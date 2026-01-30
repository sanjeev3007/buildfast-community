# BuildFast Community — Project Overview

A professional overview of how the **buildfast-community** Next.js app works: architecture, auth, cookies, hooks, state management, data flow, and workflows. Use this to onboard the team and explain how the codebase is structured.

---

## 1. Tech Stack & High-Level Architecture

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Auth & Backend** | Supabase (Auth + Postgres) |
| **State** | React `useState` / `useMemo` (no Redux/Zustand) |
| **Data** | Server Actions (primary) + REST API routes (where needed) |
| **Styling** | Tailwind CSS |

- **App Router** under `src/app/`: route groups `(main)`, pages, API routes.
- **Server Actions** under `src/actions/`: all Supabase/DB and server-side logic.
- **Components** under `src/components/`: UI only; they call actions or API.
- **Hooks** under `src/hooks/`: shared client logic (e.g. `useAuth`).
- **Types** under `src/types/`: shared TypeScript types.

---

## 2. Authentication — How It Works

### 2.1 Auth Provider: Supabase Auth

- **Google OAuth** is the only enabled provider (popup flow).
- Session is stored in **HTTP-only cookies** (managed by Supabase SSR), not `localStorage`.
- There are **two Supabase clients**:
  - **Browser** (`src/utils/supabase/client.ts`): used in client components; reads/writes cookies via the browser.
  - **Server** (`src/utils/supabase/server.ts`): used in Server Components, API routes, and **server actions**; reads/writes cookies via Next.js `cookies()`.

### 2.2 Cookie Flow (Request Lifecycle)

1. **Every request** (except static assets) goes through **middleware** (`src/middleware.ts`).
2. Middleware calls `updateSession()` in `src/utils/supabase/middleware.ts`:
   - Builds a **server Supabase client** with `getAll`/`setAll` backed by the **incoming request cookies** and the **outgoing response**.
   - Calls `supabase.auth.getUser()` so Supabase can **refresh the session** if needed.
   - Supabase may **set new cookies** on `supabaseResponse` (e.g. refreshed tokens).
3. The **response** returned from middleware is sent to the browser with updated Set-Cookie headers.
4. Result: session stays in sync on every navigation/request without a full page reload.

So: **login state lives in cookies**; middleware + server/client Supabase utilities keep that state consistent across server and client.

### 2.3 Login Flow (Google Popup)

1. User clicks “Sign in” or a protected action (e.g. Like) → **LoginDialog** opens **AuthDialog**.
2. User clicks “Continue with Google” → **AuthDialog** calls `openLoginPopup()` from **useAuth**.
3. **useAuth** opens a **popup** to `/auth/popup`.
4. **Popup page** (`src/app/auth/popup/page.tsx`):
   - Calls `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: '.../auth/callback?popup=1' })`.
   - Redirects the **popup** to Google; user signs in; Google redirects back to **/auth/callback?code=...&popup=1**.
5. **Auth callback route** (`src/app/auth/callback/route.ts`):
   - **Server-side**: uses **server Supabase client** (`createClient()` from `server.ts`), calls `exchangeCodeForSession(code)`.
   - Session is written to **cookies** in that request.
   - Redirects to `/auth/callback/close` (still in popup).
6. **Close page** (`src/app/auth/callback/close/page.tsx`):
   - Client component wrapped in **Suspense** (required because it uses `useSearchParams()`).
   - Reads `?error` from URL, then `postMessage(AUTH_SUCCESS | AUTH_ERROR)` to **opener** and closes the popup.
7. **Opener (main tab)**:
   - **useAuth**’s message listener receives `AUTH_SUCCESS`.
   - Calls `supabase.auth.getSession()` and `setUser(session?.user)` so **React state** updates immediately without a full page refresh.
   - **LoginDialog**’s `handleGoogleClick` then runs the intended action (e.g. like, comment).

So: **Auth is cookie-based**; the popup flow only exchanges the OAuth code for a session on the server and notifies the opener so the UI can update.

### 2.4 Where Auth Is Used

- **Navbar**: shows user avatar + logout when `useAuth().user` is set; logout calls `signOut()` (Supabase clears session/cookies).
- **Likes / comments**: **LoginDialog** wraps the like/comment buttons; if there’s no `user`, it opens the auth dialog; after login it runs the action (and optional `requireLogin` callback, e.g. refresh comments).

---

## 3. Hooks

### 3.1 `useAuth` (`src/hooks/useAuth.ts`)

- **Client-only**; uses `createClient()` from `@/utils/supabase/client`.
- **State**: `user` (Supabase User | null), `loading` (boolean).
- **Effects**:
  - On mount: `getUser()` then subscribe to `onAuthStateChange` to keep `user` in sync.
  - When popup sends `AUTH_SUCCESS`: `getSession()` + `setUser()` so the opener updates without reload.
- **Returns**: `{ user, loading, openLoginPopup, signOut }`.
- Used by: **Navbar**, **LoginDialog**, **TextPostEngagement** (comments/likes).

No other global auth store: **auth state is either**  
- in **cookies** (source of truth for Supabase),  
- or in **React state** inside components that use **useAuth**.

---

## 4. State Management

The app does **not** use Redux, Zustand, or a global client store.

- **Server state (data)**  
  - Fetched via **server actions** (and a few **API routes**).  
  - Stored in **local component state** (`useState`) after fetch (e.g. community page: `posts`, `isLoading`).  
  - Filtering/derived data: **useMemo** (e.g. `filteredPosts`).

- **UI state**  
  - Local: sidebar open/close, search query, platform filter, auth dialog open, etc.  
  - All **useState** in the component that owns the behavior.

- **Auth state**  
  - As above: **useAuth** holds `user` and `loading`; any component that needs “current user” uses **useAuth()**.

So: **state management is “React-only”**: component state + server actions for data, and useAuth for auth. No global store.

---

## 5. Data Fetching — Server Actions vs API Routes

### 5.1 Server Actions (Primary)

- **Location**: `src/actions/*.ts` — every file starts with `"use server"`.
- **Role**: Single entry point for all server-only logic: Supabase queries, auth checks, external fetches (e.g. link preview).
- **Usage**: Called directly from client or server components:
  - `const posts = await getAllPosts();`
  - `const result = await toggleLike(textPostId);`
- **Auth**: When the action needs the current user, it uses **server Supabase client** (`createClient()` from `@/utils/supabase/server`), which reads the session from **cookies** (no token passed from client).

**Important**: The **server** Supabase client in actions uses **Next.js `cookies()`**, so it always sees the same session that middleware refreshed. That’s why likes/comments work after login without a refresh.

### 5.2 List of Actions and What They Do

| Action module | Purpose |
|---------------|--------|
| **posts.actions** | `getAllPosts()`: fetches social posts + text posts, merges, sorts by date; returns `UnifiedPost[]`. |
| **community.actions** | `fetchSocialPosts()`: reads `community_posts` from Supabase. Community join (e.g. email signup) if present. |
| **text-posts.actions** | `getTextPosts()`, `getTextPostBySlug(slug)`, `incrementTextPostViews(slug)`: CRUD and views for blog/text posts. |
| **likes-comments.actions** | `getLikes`, `toggleLike`, `getComments`, `addComment`, `getPostCounts`: likes and threaded comments for text posts. All use **server** Supabase + auth. |
| **link-preview.actions** | `getLinkPreview({ url })`: fetches URL HTML, parses og:title / og:description / og:image, decodes HTML entities; used for social card previews. |
| **events.actions** | Fetches events (if used by sidebar). |

### 5.3 API Routes (When Used)

API routes are used when the client needs a **REST endpoint** (e.g. `fetch()` from the browser), not a direct function call.

| Route | Method | Purpose |
|-------|--------|--------|
| **/api/link-preview** | POST | Body: `{ url }`. Calls `getLinkPreview` from link-preview actions; returns JSON. Used by **PostCard** to resolve og:image/title/description per social link. |
| **/api/text-posts/[slug]/views** | POST | Calls `incrementTextPostViews(slug)`. Used by **TextPostDetail** on mount to increment view count. |
| **/api/community-join** | POST | Community email signup (if implemented). |
| **/api/events** | GET | Events list for sidebar (if implemented). |

So: **actions = main data layer**; **API routes = thin HTTP wrappers** where the client must call an HTTP endpoint (e.g. link preview from many cards, or view count from client component).

---

## 6. End-to-End Workflows

### 6.1 Loading the Community Feed

1. User opens **/community** (client component page).
2. **useEffect** runs, calls **server action** `getAllPosts()`.
3. **getAllPosts()** (server):
   - Calls `fetchSocialPosts()` (Supabase `community_posts`) and `getTextPosts()` (Supabase `community_text_posts`) in parallel.
   - Maps text posts to `{ ...post, type: 'text' }`, merges with social posts, sorts by `publishedAt`.
   - Returns `UnifiedPost[]`.
4. Page stores result in **useState** `setPosts(allPosts)`, sets **isLoading** false.
5. **useMemo** computes **filteredPosts** from `posts`, `selectedPlatform`, `searchQuery`.
6. **CommunityFeed** receives **filteredPosts** and renders **FeedItem** per post.
7. **FeedItem** discriminates `post.type`: **social** → **PostCard**, **text** → **TextPostCard**.

For **social** posts, **PostCard** often has no title/description in DB; it calls **POST /api/link-preview** with `post.externalUrl` and stores result in local state to show image/title/description.

### 6.2 Opening a Blog Post (Text Post)

1. User clicks a text post → **/community/posts/[slug]**.
2. **Page** is a **server component**: it **awaits** `getTextPostBySlug(slug)` (server action). If not found, **notFound()**.
3. Server action uses **server Supabase client** (no cookies from client; same as middleware session).
4. Page renders **TextPostDetail** with `post={result.data}`.
5. **TextPostDetail** (client) mounts, calls **POST /api/text-posts/[slug]/views** to increment views (fire-and-forget).
6. Comments/likes: **TextPostEngagement** uses **useAuth** and **LoginDialog**; it calls **getLikes**, **getComments**, **toggleLike**, **addComment** (all server actions) and keeps counts/comments in local state.

### 6.3 Liking or Commenting (Protected Actions)

1. User clicks Like or Send comment.
2. **LoginDialog** wraps the button: **handleClick** checks **useAuth().user**.
   - If **no user**: opens **AuthDialog** (modal). User clicks Google → popup flow above; after **AUTH_SUCCESS**, opener’s **useAuth** updates **user**, then **handleGoogleClick** runs **requireLogin** (e.g. refresh comments) and **onTrigger** (e.g. submit like/comment).
   - If **user** exists: runs **onTrigger** directly.
3. **onTrigger** is e.g. **handleLike** or **handleComment**: they call **toggleLike(textPostId)** or **addComment(textPostId, content, parentId)** (server actions).
4. Server actions use **server Supabase client** → **getUser()** from cookies; if unauthenticated, they return an error; otherwise they insert/delete in `community_text_post_likes` or `community_text_post_comments`.
5. Component updates local state from the action result (e.g. new like count, new comment list or refresh).

---

## 7. Supabase Clients Summary

| File | Client | Used in | Cookie / session |
|------|--------|----------|--------------------|
| **utils/supabase/client.ts** | `createBrowserClient(...)` | Client components, useAuth | Browser cookies |
| **utils/supabase/server.ts** | `createServerClient(..., { cookies: { getAll, setAll } })` | Server components, server actions, API route handlers | Next.js `cookies()` |
| **utils/supabase/middleware.ts** | `createServerClient(..., request cookies, response cookies)` | Middleware | Incoming request + outgoing response |
| **lib/supabase.ts** | `createClient(supabaseUrl, anonKey)` (plain Supabase JS client, no cookie adapter) | Server-side only, e.g. **community.actions**, **text-posts.actions** when they don’t need the current user | No session; used for public/anon reads (e.g. list posts). |

So: **user-scoped actions (likes, comments)** use **server** Supabase client from `server.ts` (cookies). **Anonymous reads** (e.g. list of posts) can use **lib/supabase.ts** or server client depending on how the code is written.

---

## 8. File Map (Quick Reference)

```
src/
├── app/
│   ├── (main)/community/          # Community feed (client) + post detail (server + client)
│   ├── api/                       # REST: link-preview, text-posts views, community-join, events
│   └── auth/                      # Popup, callback route, callback/close page
├── actions/                       # All server actions (Supabase, link preview)
├── components/                    # UI; auth (LoginDialog, AuthDialog), community (feed, cards, sidebar)
├── hooks/
│   └── useAuth.ts                 # Auth state + openLoginPopup, signOut
├── lib/
│   └── supabase.ts                # Optional anon server client (no cookie session)
├── types/                         # Shared TypeScript types
├── utils/supabase/               # client, server, middleware Supabase instances
└── middleware.ts                 # Runs updateSession (refresh auth cookies) on every request
```

---

## 9. Summary for the Team

- **Auth**: Supabase Auth with Google (popup). Session in **cookies**; middleware refreshes them; server actions read session via **server** Supabase client; client UI uses **useAuth**.
- **State**: No global store. **useState** + **useMemo** in components; server state is loaded by **server actions** and stored in component state.
- **Data**: **Server actions** are the main backend; **API routes** are used only where the client must call an HTTP endpoint (link preview, view count).
- **Workflow**: Pages either fetch in **useEffect** (client) or **await** actions in server components; protected actions go through **LoginDialog** and **useAuth**; after popup login, **useAuth** refreshes session in the opener so the UI updates without a full reload.

This is the flow and architecture the team can rely on when extending or debugging the app.
