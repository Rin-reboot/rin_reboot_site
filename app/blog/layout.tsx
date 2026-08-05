import type { ReactNode } from "react";
import { BlogFooter } from "./_components/BlogFooter";
import { BlogHeader } from "./_components/BlogHeader";
import "./blog.css";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="blog-shell">
      <BlogHeader />
      {children}
      <BlogFooter />
    </div>
  );
}
