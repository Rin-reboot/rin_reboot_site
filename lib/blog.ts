import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { z } from "zod";

const postsDirectory = path.join(process.cwd(), "content", "blog");

const dateValue = z.union([z.string(), z.date()]).transform((value) => {
  const date = value instanceof Date ? value : new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${String(value)}`);
  }
  return date.toISOString().slice(0, 10);
});

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(40).max(160),
  publishedAt: dateValue,
  updatedAt: dateValue.optional(),
  category: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  draft: z.boolean().default(false),
  image: z.string().optional(),
});

export type BlogPost = z.infer<typeof frontmatterSchema> & {
  slug: string;
  content: string;
};

export type BlogPostSummary = Omit<BlogPost, "content">;

function readPost(fileName: string): BlogPost {
  const slug = fileName.replace(/\.md$/, "");
  const source = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
  const { data, content } = matter(source);
  const metadata = frontmatterSchema.parse(data);
  return { ...metadata, slug, content };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readPost)
    .filter((post) => !post.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getCategories(): string[] {
  return [...new Set(getAllPosts().map((post) => post.category))].sort();
}

export function getTags(): string[] {
  return [...new Set(getAllPosts().flatMap((post) => post.tags))].sort();
}

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export async function renderMarkdown(content: string): Promise<{ html: string; toc: TocItem[] }> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: "github-dark-default",
      keepBackground: true,
    })
    .use(rehypeStringify)
    .process(content);
  const html = String(result);
  const $ = load(html, null, false);
  const toc: TocItem[] = [];
  $("h2, h3").each((_, heading) => {
    const id = $(heading).attr("id");
    if (id) {
      toc.push({
        id,
        text: $(heading).text(),
        level: Number(heading.tagName.slice(1)) as 2 | 3,
      });
    }
  });
  return { html, toc };
}
