"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/blog";

type ReturnDestination = { href: string; label: string };

function getReturnDestination(): ReturnDestination {
  const params = new URLSearchParams(window.location.search);
  const from = params.get("from");
  const value = params.get("value");
  if (from === "category" && value) {
    return { href: `/blog/category/${encodeURIComponent(value)}/`, label: `${value}カテゴリの記事一覧へ` };
  }
  if (from === "tag" && value) {
    return { href: `/blog/tag/${encodeURIComponent(value)}/`, label: `#${value}の記事一覧へ` };
  }
  return { href: "/blog/", label: "記事一覧へ戻る" };
}

export function ArticleNavigation({ toc }: { toc: TocItem[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [destination, setDestination] = useState<ReturnDestination>({ href: "/blog/", label: "記事一覧へ戻る" });

  useEffect(() => {
    setDestination(getReturnDestination());
    const updateVisibility = () => setIsVisible(window.scrollY >= 480);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  useEffect(() => {
    if (!isTocOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsTocOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isTocOpen]);

  const scrollToTop = () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
  };

  return (
    <>
      <nav className="article-return" aria-label="記事一覧へ戻る">
        <Link href={destination.href}><span aria-hidden="true">←</span> {destination.label}</Link>
      </nav>
      {isVisible && (
        <div className="article-floating-actions">
          <button type="button" aria-expanded={isTocOpen} aria-controls="floating-toc" onClick={() => setIsTocOpen((open) => !open)}>ToC</button>
          <button type="button" aria-label="ページ上部へ戻る" onClick={scrollToTop}>↑</button>
        </div>
      )}
      {isVisible && isTocOpen && (
        <aside className="floating-toc" id="floating-toc" aria-label="目次">
          <header><p>TABLE OF CONTENTS</p><button type="button" aria-label="目次を閉じる" onClick={() => setIsTocOpen(false)}>×</button></header>
          <TocList toc={toc} onNavigate={() => setIsTocOpen(false)} />
        </aside>
      )}
    </>
  );
}

export function ArticleToc({ toc }: { toc: TocItem[] }) {
  return <nav className="article-toc" aria-label="目次"><p>TABLE OF CONTENTS</p><TocList toc={toc} /></nav>;
}

function TocList({ toc, onNavigate }: { toc: TocItem[]; onNavigate?: () => void }) {
  return <ol>{toc.map((item) => <li className={item.level === 3 ? "toc-level-3" : undefined} key={item.id}><a href={`#${item.id}`} onClick={onNavigate}>{item.text}</a></li>)}</ol>;
}
