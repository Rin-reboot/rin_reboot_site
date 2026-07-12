import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const directory = path.join(process.cwd(), "content", "blog");
const files = fs.existsSync(directory) ? fs.readdirSync(directory).filter((file) => file.endsWith(".md")) : [];
const errors = [];
const slugs = new Set();
for (const file of files) {
  const slug = file.replace(/\.md$/, "");
  if (slugs.has(slug)) errors.push(`${file}: slugが重複しています`);
  slugs.add(slug);
  const { data, content } = matter(fs.readFileSync(path.join(directory, file), "utf8"));
  for (const key of ["title", "description", "publishedAt", "category", "tags"]) if (!data[key] || (Array.isArray(data[key]) && data[key].length === 0)) errors.push(`${file}: ${key}は必須です`);
  if (data.description && (data.description.length < 40 || data.description.length > 160)) errors.push(`${file}: descriptionは40〜160文字にしてください`);
  if (Array.isArray(data.tags) && new Set(data.tags).size !== data.tags.length) errors.push(`${file}: タグが重複しています`);
  const tree = unified().use(remarkParse).parse(content);
  let previousDepth = 1;
  let firstHeading = true;
  visit(tree, "heading", (node) => {
    if (node.depth === 1) errors.push(`${file}:${node.position.start.line}: 本文にh1は使用できません。記事タイトルがh1になります`);
    if (firstHeading && node.depth !== 2) errors.push(`${file}:${node.position.start.line}: 最初の見出しはh2にしてください`);
    if (!firstHeading && node.depth > previousDepth + 1) errors.push(`${file}:${node.position.start.line}: 見出しレベルがh${previousDepth}からh${node.depth}へ飛んでいます`);
    previousDepth = node.depth;
    firstHeading = false;
  });
  if (firstHeading) errors.push(`${file}: h2見出しを1つ以上追加してください`);
}
if (errors.length) { console.error(`ブログ記事の検証に失敗しました:\n- ${errors.join("\n- ")}`); process.exit(1); }
console.log(`${files.length}件のブログ記事を検証しました。`);
