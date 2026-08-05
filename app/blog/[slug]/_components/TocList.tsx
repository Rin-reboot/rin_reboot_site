import type { TocItem } from "@/lib/blog";

type TocListProps = {
  toc: TocItem[];
  onNavigate?: () => void;
};

export function TocList({ toc, onNavigate }: TocListProps) {
  return (
    <ol>
      {toc.map((item) => (
        <li
          className={item.level === 3 ? "toc-level-3" : undefined}
          key={item.id}
        >
          <a href={`#${item.id}`} onClick={onNavigate}>
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}
