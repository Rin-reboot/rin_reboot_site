import type { MetadataRoute } from "next";
import { getAllPosts, getCategories, getTags } from "@/lib/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rin-reboot-site.pages.dev";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    { url: siteUrl, lastModified: new Date(), priority: 1 },
    { url: `${siteUrl}/blog/`, lastModified: new Date(), priority: .9 },
    ...posts.map((post) => ({ url: `${siteUrl}/blog/${post.slug}/`, lastModified: new Date(post.updatedAt || post.publishedAt), priority: .8 })),
    ...getCategories().map((category) => ({ url: `${siteUrl}/blog/category/${encodeURIComponent(category)}/`, lastModified: new Date(), priority: .6 })),
    ...getTags().map((tag) => ({ url: `${siteUrl}/blog/tag/${encodeURIComponent(tag)}/`, lastModified: new Date(), priority: .5 })),
  ];
}
