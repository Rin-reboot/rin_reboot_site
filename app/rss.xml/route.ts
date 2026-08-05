import { getAllPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export const dynamic = "force-static";
export function GET() {
  const items = getAllPosts()
    .map(
      (post) =>
        `<item><title>${escapeXml(post.title)}</title><link>${siteUrl}/blog/${post.slug}/</link><guid>${siteUrl}/blog/${post.slug}/</guid><pubDate>${new Date(`${post.publishedAt}T00:00:00Z`).toUTCString()}</pubDate><description>${escapeXml(post.description)}</description></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Rin Blog</title><link>${siteUrl}/blog/</link><description>Rinの技術ブログ</description>${items}</channel></rss>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
