import compileMDX from "@/lib/compileMDX";
import { bundleMDX } from "mdx-bundler";
import { NextResponse } from "next/server";
import rehypeKatex from "rehype-katex";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

export async function POST(request: Request) {
  const formData = await request.formData();
  const mdxSource = formData.get("mdxSource") as string;

  const result = await compileMDX(mdxSource)
    .then((result) =>
      NextResponse.json(
        { code: result.code, frontmatter: result.frontmatter },
        { status: 200 },
      ),
    )
    .catch((errReason) =>
      NextResponse.json(
        { code: "", frontmatter: { error: errReason } },
        { status: 400 },
      ),
    );

  return result;
}
