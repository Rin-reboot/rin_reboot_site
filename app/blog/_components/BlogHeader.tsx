import Link from "next/link";

export function BlogHeader() {
  return (
    <header className="blog-header">
      <Link className="brand" href="/" aria-label="トップページへ">
        R<span>.</span>
      </Link>
      <nav aria-label="ブログナビゲーション">
        <Link href="/">Portfolio</Link>
        <Link href="/blog/">Blog</Link>
      </nav>
    </header>
  );
}
