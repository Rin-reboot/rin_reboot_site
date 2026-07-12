import type { Metadata } from "next";
import { getAllPosts, getCategories, getTags } from "@/lib/blog";
import { BlogFilter } from "./BlogFilter";
import { Breadcrumbs } from "./components";

export const metadata: Metadata = {
  title: "Blog | Rin",
  description: "フロントエンド、デスクトップ開発、UI設計について記録するRinの技術ブログ。",
  alternates: { canonical: "/blog/" },
  openGraph: { title: "Blog | Rin", description: "Rinの技術ブログ。", url: "/blog/", type: "website" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <main className="blog-main"><Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog/" }]} /><header className="blog-hero"><p>JOURNAL / NOTES</p><h1>Blog.</h1><p>つくったもの、試した技術、設計で考えたことを記録します。</p></header><BlogFilter posts={posts} categories={getCategories()} tags={getTags()} /></main>;
}
