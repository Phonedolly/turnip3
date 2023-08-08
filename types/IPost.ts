import { MDXContentProps } from "mdx-bundler/client";

export interface IPost {
  code: string;
  frontmatter: IFrontmatter;
  mdx: string;
  category?: string;
  epoch?: number;
  title?: string;
  mdxHasProblem?: boolean;
}
