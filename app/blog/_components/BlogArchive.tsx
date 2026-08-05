import type { BlogPostSummary } from "@/lib/blog";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";
import { PostList, type PostListOrigin } from "./PostList";

type BlogArchiveProps = {
  breadcrumbs: BreadcrumbItem[];
  label: string;
  title: string;
  posts: BlogPostSummary[];
  origin: PostListOrigin;
};

export function BlogArchive({
  breadcrumbs,
  label,
  title,
  posts,
  origin,
}: BlogArchiveProps) {
  return (
    <main className="blog-main">
      <Breadcrumbs items={breadcrumbs} />
      <header className="archive-heading">
        <p>{label}</p>
        <h1>{title}</h1>
        <p>{posts.length}件の記事</p>
      </header>
      <PostList posts={posts} origin={origin} />
    </main>
  );
}
