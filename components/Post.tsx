'use client';

import MDXComponents from '@/components/MDXComponents'
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


export default function Post(props: {
  post: {
    originalPost: string;
    epoch: number;
    compiledPost: {
      content: JSX.Element;
      frontmatter: {
        title?: string | undefined;
        category?: string | undefined;
        thumbnail: string;
        epoch: number;
        date?: string | undefined;
        description?: string | undefined;
      };
    }
  }

}) {
  const { default: compiledMdx, frontmatter } = evaluateSync(props.post.originalPost, {
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

  const element = compiledMdx({})
  return <div className='flex flex-col items-center w-full h-full'>{element}</div>
}