"use client";

import MDXComponents from "@/components/MDXUI";
import * as runtime from "react/jsx-runtime";
import { evaluate, evaluateSync } from "@mdx-js/mdx";
import componentsGenerator from "@/components/MDXUI";
import "highlight.js/styles/github.css";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";

export default function Post(props: { code: string; imageSizes: IImageSizes }) {
  const Component = useMemo(() => getMDXComponent(props.code), [props.code]);
  return (
    <div className="flex h-full w-full flex-col items-center">
      <Component components={componentsGenerator(props.imageSizes)} />
    </div>
  );
}
