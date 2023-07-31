import { MDXContentProps } from "mdx-bundler/client";

export interface IPost {
  code: string;
  frontmatter: {
    [key: string]: any;
  };
  mdx: string;
  content: React.FunctionComponent<MDXContentProps>;
  category?: string;
  epoch?: number;
  title?: string;
  mdxHasProblem?: boolean;
}
