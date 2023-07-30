import * as runtime from "react/jsx-runtime";
import { evaluate, evaluateSync } from "@mdx-js/mdx";
import components from "@/components/MDXComponents";
import "highlight.js/styles/github.css";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";

const mainpulateMdx = (compiledMdx: Function, frontmatter: object) => {
  const convertedFrontmatter = frontmatter as StabilizedFrontmatter;
  const stabilizedFrontmatter: StabilizedFrontmatter = {
    ...convertedFrontmatter,
    epoch: Number(convertedFrontmatter.epoch),
  };
  const content = compiledMdx({
    components,
  });
  return {
    content,
    frontmatter: stabilizedFrontmatter,
  };
};

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

  return mainpulateMdx(compiledMdx, frontmatter as object);
};

export const compileMdxSync = (newMdx: string) => {
  const { default: compiledMdx, frontmatter } = evaluateSync(newMdx, {
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

  return mainpulateMdx(compiledMdx, frontmatter as object);
};

export const compileMdxSyncCompiledOnly = (newMdx: string) => {
  const { default: compiledMdx, frontmatter } = evaluateSync(newMdx, {
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

  return {
    compiledMdx,
    frontmatter: { ...frontmatter, epoch: Number(frontmatter?.epoch) },
  };
};
