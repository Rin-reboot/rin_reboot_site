import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, renderMarkdown } from "@/lib/blog";
import { siteUrl } from "@/lib/site";
import { Breadcrumbs } from "../_components/Breadcrumbs";
import { ArticleNavigation } from "./ArticleNavigation";
import { ArticleToc } from "./_components/ArticleToc";

export const dynamicParams = false;
export function generateStaticParams() {
  const params = getAllPosts().map((post) => ({ slug: post.slug }));
  return params.length > 0 ? params : [{ slug: "__empty__" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}/`;
  return {
    title: `${post.title} | Rin Blog`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [post.image || "/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image || "/og.png"],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const { html, toc } = await renderMarkdown(post.content);
  const url = new URL(`/blog/${post.slug}/`, siteUrl).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@type": "Person", name: "Rin", url: siteUrl },
    mainEntityOfPage: url,
    url,
    image: new URL(post.image || "/og.png", siteUrl).toString(),
    articleSection: post.category,
    keywords: post.tags.join(", "),
  };
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog/" },
    {
      name: post.category,
      href: `/blog/category/${encodeURIComponent(post.category)}/`,
    },
    { name: post.title, href: `/blog/${post.slug}/` },
  ];
  const articleHtml = { __html: html };
  const serializedJsonLd = {
    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
  };

  return (
    <main className="blog-main">
      <Breadcrumbs items={breadcrumbs} />
      <article className="blog-article">
        <header>
          <p className="article-category">
            <Link href={`/blog/category/${encodeURIComponent(post.category)}/`}>
              {post.category}
            </Link>
          </p>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <div className="article-dates">
            <time dateTime={post.publishedAt}>公開 {post.publishedAt}</time>
            {post.updatedAt && (
              <time dateTime={post.updatedAt}>更新 {post.updatedAt}</time>
            )}
          </div>
          <ul aria-label="記事のタグ">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link href={`/blog/tag/${encodeURIComponent(tag)}/`}>
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        </header>
        <ArticleToc toc={toc} />
        <div
          className="article-body"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown is converted without raw HTML support from trusted repository content.
          dangerouslySetInnerHTML={articleHtml}
        />
        <ArticleNavigation toc={toc} />
      </article>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from trusted local metadata and escapes opening brackets.
        dangerouslySetInnerHTML={serializedJsonLd}
      />
    </main>
  );
}
