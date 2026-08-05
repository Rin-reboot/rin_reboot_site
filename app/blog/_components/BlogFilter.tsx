"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent } from "react";
import type { BlogPostSummary } from "@/lib/blog";
import { PostList } from "./PostList";

type BlogFilterProps = {
  posts: BlogPostSummary[];
  categories: string[];
  tags: string[];
};

export function BlogFilter({ posts, categories, tags }: BlogFilterProps) {
  const [category, setCategory] = useState("all");
  const [tag, setTag] = useState("all");
  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          (category === "all" || post.category === category) &&
          (tag === "all" || post.tags.includes(tag)),
      ),
    [posts, category, tag],
  );
  const hasActiveFilters = category !== "all" || tag !== "all";

  function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    setCategory(event.target.value);
  }

  function handleTagChange(event: ChangeEvent<HTMLSelectElement>) {
    setTag(event.target.value);
  }

  function handleFilterReset() {
    setCategory("all");
    setTag("all");
  }

  if (posts.length === 0) {
    return (
      <section
        className="blog-empty blog-empty-initial"
        aria-labelledby="blog-empty-title"
      >
        <p>FIRST ENTRY / SOON</p>
        <h2 id="blog-empty-title">最初の記事を準備中です。</h2>
        <p>制作や設計で考えたことを、少しずつここに追加していきます。</p>
        <Link href="/">
          ポートフォリオへ戻る <span aria-hidden="true">→</span>
        </Link>
      </section>
    );
  }

  return (
    <>
      <fieldset className="blog-filters">
        <legend>記事の絞り込み</legend>
        <label>
          カテゴリ
          <select value={category} onChange={handleCategoryChange}>
            <option value="all">すべて</option>
            {categories.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          タグ
          <select value={tag} onChange={handleTagChange}>
            <option value="all">すべて</option>
            {tags.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        {hasActiveFilters && (
          <button type="button" onClick={handleFilterReset}>
            絞り込みを解除
          </button>
        )}
        <p aria-live="polite">{filteredPosts.length}件の記事</p>
      </fieldset>
      {filteredPosts.length > 0 ? (
        <PostList posts={filteredPosts} />
      ) : (
        <p className="blog-empty">条件に一致する記事はありません。</p>
      )}
    </>
  );
}
