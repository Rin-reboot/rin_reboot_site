"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPostSummary } from "@/lib/blog";
import { PostList } from "./components";

export function BlogFilter({ posts, categories, tags }: { posts: BlogPostSummary[]; categories: string[]; tags: string[] }) {
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const filteredPosts = useMemo(() => posts.filter((post) => (category === "all" || post.category === category) && (tag === "all" || post.tags.includes(tag))), [posts, category, tag]);

  if (posts.length === 0) {
    return (
      <section className="blog-empty blog-empty-initial" aria-labelledby="blog-empty-title">
        <p>FIRST ENTRY / SOON</p>
        <h2 id="blog-empty-title">最初の記事を準備中です。</h2>
        <p>制作や設計で考えたことを、少しずつここに追加していきます。</p>
        <Link href="/">ポートフォリオへ戻る <span aria-hidden="true">→</span></Link>
      </section>
    );
  }

  return (
    <>
      <fieldset className="blog-filters">
        <legend>記事の絞り込み</legend>
        <label>カテゴリ<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">すべて</option>{categories.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <label>タグ<select value={tag} onChange={(event) => setTag(event.target.value)}><option value="all">すべて</option>{tags.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        {(category !== "all" || tag !== "all") && <button type="button" onClick={() => { setCategory("all"); setTag("all"); }}>絞り込みを解除</button>}
        <p aria-live="polite">{filteredPosts.length}件の記事</p>
      </fieldset>
      {filteredPosts.length > 0 ? <PostList posts={filteredPosts} /> : <p className="blog-empty">条件に一致する記事はありません。</p>}
    </>
  );
}
