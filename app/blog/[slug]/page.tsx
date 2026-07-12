import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, renderMarkdown } from "@/lib/blog";
import { Breadcrumbs, siteUrl } from "../components";
import { ArticleNavigation, ArticleToc } from "./ArticleNavigation";

export const dynamicParams = false;
export function generateStaticParams() {
  const params = getAllPosts().map((post) => ({ slug: post.slug }));
  return params.length > 0 ? params : [{ slug: "__empty__" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}/`;
  return {
    title: `${post.title} | Rin Blog`, description: post.description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: post.title, description: post.description, publishedTime: post.publishedAt, modifiedTime: post.updatedAt, tags: post.tags, images: [post.image || "/og.png"] },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.image || "/og.png"] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const { html, toc } = await renderMarkdown(post.content);
  const url = new URL(`/blog/${post.slug}/`, siteUrl).toString();
  const jsonLd = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, datePublished: post.publishedAt, dateModified: post.updatedAt || post.publishedAt, author: { "@type": "Person", name: "Rin", url: siteUrl }, mainEntityOfPage: url, url, image: new URL(post.image || "/og.png", siteUrl).toString(), articleSection: post.category, keywords: post.tags.join(", ") };
  return <main className="blog-main"><Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog/" }, { name: post.category, href: `/blog/category/${encodeURIComponent(post.category)}/` }, { name: post.title, href: `/blog/${post.slug}/` }]} /><article className="blog-article"><header><p className="article-category"><Link href={`/blog/category/${encodeURIComponent(post.category)}/`}>{post.category}</Link></p><h1>{post.title}</h1><p className="article-description">{post.description}</p><div className="article-dates"><time dateTime={post.publishedAt}>公開 {post.publishedAt}</time>{post.updatedAt && <time dateTime={post.updatedAt}>更新 {post.updatedAt}</time>}</div><ul aria-label="記事のタグ">{post.tags.map((tag) => <li key={tag}><Link href={`/blog/tag/${encodeURIComponent(tag)}/`}>#{tag}</Link></li>)}</ul></header><ArticleToc toc={toc} />{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown is converted without raw HTML support from trusted repository content. */}<div className="article-body" dangerouslySetInnerHTML={{ __html: html }} /><ArticleNavigation toc={toc} /></article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /></main>;
}
