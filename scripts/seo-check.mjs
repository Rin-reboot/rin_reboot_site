import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const out = path.join(process.cwd(), "out");
const htmlFiles = [];
function collect(directory) { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const fullPath = path.join(directory, entry.name); if (entry.isDirectory()) collect(fullPath); else if (entry.name.endsWith(".html")) { const relative = path.relative(out, fullPath).replaceAll(path.sep, "/"); if (relative === "blog.html" || relative.startsWith("blog/")) htmlFiles.push(fullPath); } } }
collect(out);
const errors = [];
for (const file of htmlFiles) {
  const $ = load(fs.readFileSync(file, "utf8"));
  const relative = path.relative(out, file);
  const normalized = relative.replaceAll(path.sep, "/");
  if (normalized.includes("/__empty__.html")) continue;
  if ($("h1").length !== 1) errors.push(`${relative}: h1は1つ必要です（現在${$("h1").length}）`);
  let previous = 1;
  $("h1,h2,h3,h4,h5,h6").each((_, heading) => { const depth = Number(heading.tagName.slice(1)); if (depth > previous + 1) errors.push(`${relative}: h${previous}からh${depth}へ見出しレベルが飛んでいます`); previous = depth; });
  if (!$('link[rel="canonical"]').attr("href")) errors.push(`${relative}: canonicalがありません`);
  if (!$('meta[name="description"]').attr("content")) errors.push(`${relative}: meta descriptionがありません`);
  if ($('nav[aria-label="パンくず"]').length !== 1) errors.push(`${relative}: パンくずがありません`);
  const jsonLd = $('script[type="application/ld+json"]').toArray().map((node) => $(node).text());
  if (!jsonLd.some((value) => value.includes('"BreadcrumbList"'))) errors.push(`${relative}: BreadcrumbListがありません`);
  if (/^blog\/[^/]+\.html$/.test(normalized) && !jsonLd.some((value) => value.includes('"BlogPosting"'))) errors.push(`${relative}: BlogPostingがありません`);
  $("h2,h3,h4,h5,h6").each((_, heading) => { if (!$(heading).attr("id") && $(heading).closest(".article-body").length) errors.push(`${relative}: 本文見出しにidがありません`); });
}
for (const required of ["sitemap.xml", "robots.txt", "rss.xml"]) if (!fs.existsSync(path.join(out, required))) errors.push(`${required}が生成されていません`);
if (errors.length) { console.error(`生成HTMLのSEO検証に失敗しました:\n- ${errors.join("\n- ")}`); process.exit(1); }
console.log(`${htmlFiles.length}件のブログHTMLとSEOファイルを検証しました。`);
