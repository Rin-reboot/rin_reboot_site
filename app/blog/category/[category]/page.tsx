import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getCategories } from "@/lib/blog";
import { Breadcrumbs, PostList } from "../../components";

export const dynamicParams = false;
export function generateStaticParams() { return getCategories().map((category) => ({ category })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category } = await params; return { title: `${category}の記事 | Rin Blog`, description: `${category}カテゴリの技術記事一覧です。`, alternates: { canonical: `/blog/category/${encodeURIComponent(category)}/` } }; }
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; if (!getCategories().includes(category)) notFound(); const posts = getAllPosts().filter((post) => post.category === category); return <main className="blog-main"><Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog/" }, { name: "Category", href: "/blog/" }, { name: category, href: `/blog/category/${encodeURIComponent(category)}/` }]} /><header className="archive-heading"><p>CATEGORY</p><h1>{category}</h1><p>{posts.length}件の記事</p></header><PostList posts={posts} origin={{ type: "category", value: category }} /></main>; }
