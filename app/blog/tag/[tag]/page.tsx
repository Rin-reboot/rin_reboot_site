import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getTags } from "@/lib/blog";
import { BlogArchive } from "../../_components/BlogArchive";

export const dynamicParams = false;
export function generateStaticParams() {
  const params = getTags().map((tag) => ({ tag }));
  return params.length > 0 ? params : [{ tag: "__empty__" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}の記事 | Rin Blog`,
    description: `${tag}タグの技術記事一覧です。`,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(tag)}/` },
  };
}
export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  if (!getTags().includes(tag)) notFound();
  const posts = getAllPosts().filter((post) => post.tags.includes(tag));
  const title = `#${tag}`;
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog/" },
    { name: "Tag", href: "/blog/" },
    { name: title, href: `/blog/tag/${encodeURIComponent(tag)}/` },
  ];
  const origin = { type: "tag", value: tag } as const;

  return (
    <BlogArchive
      breadcrumbs={breadcrumbs}
      label="TAG"
      title={title}
      posts={posts}
      origin={origin}
    />
  );
}
