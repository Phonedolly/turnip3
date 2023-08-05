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

  const result = await bundleMDX({
    source: mdxSource,
    mdxOptions(options, frontmatter) {
      options.remarkPlugins = [
        remarkGfm,
        remarkMath,
        remarkFrontmatter,
        remarkMdxFrontmatter,
      ];
      options.rehypePlugins = [rehypeKatex, rehypeMdxCodeProps];

      return options;
    },
  })
    .then((result) => result)
    .catch((errReason) => {
      return { code: "", frontmatter: { error: errReason } };
    });

  return NextResponse.json(
    {
      code: result.code,
      frontmatter: result.frontmatter,
    },
    { status: result.frontmatter.error ? 400 : 200 },
  );
}
