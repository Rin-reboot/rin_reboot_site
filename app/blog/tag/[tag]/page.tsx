import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getTags } from "@/lib/blog";
import { Breadcrumbs, PostList } from "../../components";

export const dynamicParams = false;
export function generateStaticParams() { return getTags().map((tag) => ({ tag })); }
export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> { const { tag } = await params; return { title: `#${tag}の記事 | Rin Blog`, description: `${tag}タグの技術記事一覧です。`, alternates: { canonical: `/blog/tag/${encodeURIComponent(tag)}/` } }; }
export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) { const { tag } = await params; if (!getTags().includes(tag)) notFound(); const posts = getAllPosts().filter((post) => post.tags.includes(tag)); return <main className="blog-main"><Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog/" }, { name: "Tag", href: "/blog/" }, { name: `#${tag}`, href: `/blog/tag/${encodeURIComponent(tag)}/` }]} /><header className="archive-heading"><p>TAG</p><h1>#{tag}</h1><p>{posts.length}件の記事</p></header><PostList posts={posts} origin={{ type: "tag", value: tag }} /></main>; }
