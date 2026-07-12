import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rin-reboot-site.pages.dev";

export type BreadcrumbItem = { name: string; href: string };

export function BlogHeader() {
  return (
    <header className="blog-header">
      <Link className="brand" href="/" aria-label="トップページへ">R<span>.</span></Link>
      <nav aria-label="ブログナビゲーション">
        <Link href="/">Portfolio</Link>
        <Link href="/blog/">Blog</Link>
        <a href="https://github.com/Rin-reboot" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.href, siteUrl).toString(),
    })),
  };

  return (
    <>
      <nav className="breadcrumbs" aria-label="パンくず">
        <ol>{items.map((item, index) => (
          <li key={item.href}>
            {index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.href}>{item.name}</Link>}
          </li>
        ))}</ol>
      </nav>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from trusted local metadata and escapes opening brackets. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}

export type PostListOrigin =
  | { type: "blog" }
  | { type: "category"; value: string }
  | { type: "tag"; value: string };

function getPostHref(slug: string, origin: PostListOrigin) {
  const query = origin.type === "blog" ? { from: "blog" } : { from: origin.type, value: origin.value };
  return { pathname: `/blog/${slug}/`, query };
}

export function PostList({ posts, origin = { type: "blog" } }: { posts: BlogPostSummary[]; origin?: PostListOrigin }) {
  return (
    <div className="blog-list">
      {posts.map((post) => (
        <article className="blog-card" key={post.slug}>
          <div className="blog-card-meta"><time dateTime={post.publishedAt}>{post.publishedAt}</time><Link href={`/blog/category/${encodeURIComponent(post.category)}/`}>{post.category}</Link></div>
          <h2><Link href={getPostHref(post.slug, origin)}>{post.title}</Link></h2>
          <p>{post.description}</p>
          <ul aria-label={`${post.title}のタグ`}>{post.tags.map((tag) => <li key={tag}><Link href={`/blog/tag/${encodeURIComponent(tag)}/`}>#{tag}</Link></li>)}</ul>
        </article>
      ))}
    </div>
  );
}

export function BlogFooter() {
  return <footer className="blog-footer"><span>© {new Date().getFullYear()} Rin</span><Link href="/">Portfolioへ戻る</Link></footer>;
}
