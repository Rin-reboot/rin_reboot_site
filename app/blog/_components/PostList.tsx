import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog";

export type PostListOrigin =
  | { type: "blog" }
  | { type: "category"; value: string }
  | { type: "tag"; value: string };

type PostListProps = {
  posts: BlogPostSummary[];
  origin?: PostListOrigin;
};

function getPostHref(slug: string, origin: PostListOrigin) {
  const query =
    origin.type === "blog"
      ? { from: "blog" }
      : { from: origin.type, value: origin.value };

  return {
    pathname: `/blog/${slug}/`,
    query,
  };
}

export function PostList({ posts, origin = { type: "blog" } }: PostListProps) {
  return (
    <div className="blog-list">
      {posts.map((post) => (
        <article className="blog-card" key={post.slug}>
          <div className="blog-card-meta">
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            <Link href={`/blog/category/${encodeURIComponent(post.category)}/`}>
              {post.category}
            </Link>
          </div>
          <h2>
            <Link href={getPostHref(post.slug, origin)}>{post.title}</Link>
          </h2>
          <p>{post.description}</p>
          <ul aria-label={`${post.title}のタグ`}>
            {post.tags.map((tag) => (
              <li key={tag}>
                <Link href={`/blog/tag/${encodeURIComponent(tag)}/`}>
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
