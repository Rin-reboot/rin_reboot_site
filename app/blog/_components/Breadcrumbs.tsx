import Link from "next/link";
import { siteUrl } from "@/lib/site";

export type BreadcrumbItem = {
  name: string;
  href: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.href, siteUrl).toString(),
    })),
  };
  const serializedJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <nav className="breadcrumbs" aria-label="パンくず">
        <ol>
          {items.map((item, index) => (
            <li key={item.href}>
              {index === items.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.href}>{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from trusted local metadata and escapes opening brackets.
        dangerouslySetInnerHTML={{ __html: serializedJsonLd }}
      />
    </>
  );
}
