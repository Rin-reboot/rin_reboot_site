import type { ReactNode } from "react";
import { BlogFooter, BlogHeader } from "./components";
import "./blog.css";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="blog-shell"><BlogHeader />{children}<BlogFooter /></div>;
}
