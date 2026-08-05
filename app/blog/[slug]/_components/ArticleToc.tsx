import type { TocItem } from "@/lib/blog";
import { TocList } from "./TocList";

type ArticleTocProps = {
  toc: TocItem[];
};

export function ArticleToc({ toc }: ArticleTocProps) {
  return (
    <nav className="article-toc" aria-label="目次">
      <p>TABLE OF CONTENTS</p>
      <TocList toc={toc} />
    </nav>
  );
}
