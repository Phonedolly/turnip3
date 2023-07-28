import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import components from "@/components/MDXComponents";
import "highlight.js/styles/github.css";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";

export const compileMdx = async (newMdx: string) => {
  const { default: compiledMdx, frontmatter } = await evaluate(newMdx, {
    ...(runtime as any),
    development: false,
    rehypePlugins: [rehypeMdxCodeProps, rehypeKatex],
    remarkPlugins: [
      remarkGfm,
      remarkMath,
      remarkFrontmatter,
      remarkMdxFrontmatter,
    ],
  });
  const content = compiledMdx({
    components,
  });
  let frontmatterWithProperties = {
    ...(frontmatter as object),
    epoch: Number(frontmatter?.epoch),
  } as {
    title?: string;
    category?: string;
    thumbnail: string,
    epoch: number;
    date?: string;
    description?: string;

  };

  return {
    content,
    frontmatter: frontmatterWithProperties,
  };
};
