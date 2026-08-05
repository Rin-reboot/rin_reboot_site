import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getCategories } from "@/lib/blog";
import { BlogArchive } from "../../_components/BlogArchive";

export const dynamicParams = false;
export function generateStaticParams() {
  const params = getCategories().map((category) => ({ category }));
  return params.length > 0 ? params : [{ category: "__empty__" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `${category}の記事 | Rin Blog`,
    description: `${category}カテゴリの技術記事一覧です。`,
    alternates: {
      canonical: `/blog/category/${encodeURIComponent(category)}/`,
    },
  };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!getCategories().includes(category)) notFound();
  const posts = getAllPosts().filter((post) => post.category === category);
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog/" },
    { name: "Category", href: "/blog/" },
    {
      name: category,
      href: `/blog/category/${encodeURIComponent(category)}/`,
    },
  ];
  const origin = { type: "category", value: category } as const;

  return (
    <BlogArchive
      breadcrumbs={breadcrumbs}
      label="CATEGORY"
      title={category}
      posts={posts}
      origin={origin}
    />
  );
}
