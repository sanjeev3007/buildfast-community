"use server";

import {
  type LinkPreviewRequest,
  type LinkPreviewResponse,
  type LinkPreviewSuccess,
  type LinkPreviewError,
} from "@/types/link-preview.types";

/**
 * Decodes HTML entities in text
 */
function decodeHtmlEntities(text: string): string {
  if (!text) return text;
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Extracts meta tag content from HTML
 */
function pickMeta(html: string, key: string): string | null {
  // Try to match property first, then content
  let regex = new RegExp(
    `<meta\\s+(?:property|name)=["']${key}["']\\s+content=["']([^"']+)["']`,
    "i"
  );
  let match = html.match(regex);

  if (match) return decodeHtmlEntities(match[1]);

  // Try alternate order or spacing
  regex = new RegExp(
    `<meta\\s+content=["']([^"']+)["']\\s+(?:property|name)=["']${key}["']`,
    "i"
  );
  match = html.match(regex);

  return match ? decodeHtmlEntities(match[1]) : null;
}

/**
 * Server action to fetch link preview (Open Graph / Twitter Card metadata)
 * @param request - LinkPreviewRequest containing URL
 * @returns LinkPreviewResponse with title, description, image, etc.
 */
export async function getLinkPreview(
  request: LinkPreviewRequest
): Promise<LinkPreviewResponse> {
  try {
    const { url } = request;

    if (!url || typeof url !== "string") {
      return { error: "Invalid url" };
    }

    // Basic safety check
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return { error: "URL must start with http/https" };
    }

    const res = await fetch(url, {
      headers: {
        // Use a bot user agent that is commonly allowlisted for OG tags
        "User-Agent":
          "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return { error: `Failed to fetch url: ${res.status}` };
    }

    const html = await res.text();

    const getMeta = (key: string) => pickMeta(html, key);

    const title =
      getMeta("og:title") || getMeta("twitter:title") || null;

    const description =
      getMeta("og:description") ||
      getMeta("twitter:description") ||
      null;

    let image =
      getMeta("og:image") || getMeta("twitter:image") || null;

    if (image && !image.startsWith("http")) {
      try {
        image = new URL(image, url).href;
      } catch {
        // Keep original if resolution fails
      }
    }

    const siteName = getMeta("og:site_name") || null;

    const result: LinkPreviewSuccess = {
      url,
      title,
      description,
      image,
      siteName,
    };

    return result;
  } catch (err) {
    console.error("[getLinkPreview] Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return { error: message };
  }
}
