import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "BuildFastWithAI - Build Faster With AI. Together.",
  description: "A community for builders sharing AI tools, workflows, insights, and real-world learnings. Join developers, founders, and AI enthusiasts building products faster.",
  keywords: ["AI", "community", "developers", "founders", "AI tools", "workflows", "SaaS", "startups", "no-code", "automation"],
  authors: [{ name: "BuildFastWithAI" }],
  openGraph: {
    title: "BuildFastWithAI - Build Faster With AI. Together.",
    description: "A community for builders sharing AI tools, workflows, insights, and real-world learnings.",
    type: "website",
    locale: "en_US",
    siteName: "BuildFastWithAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildFastWithAI - Build Faster With AI. Together.",
    description: "A community for builders sharing AI tools, workflows, insights, and real-world learnings.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <div className="hidden" />
        <div className="hidden" />
        <main style={{ minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
