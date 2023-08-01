import { SessionProvider, signIn, signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/authOptions";
import SignIn from "@/components/SignIn";
import SignOut from "@/components/SignOut";
import Editor from "@/components/MDXEditor";
import Writer from "@/components/Writer";
import initNewPost from "@/lib/initNewPost";
import getImagesSizes from "@/lib/getImageSizes";
import { initS3Client } from "@/lib/S3";
import { bundleMDX } from "mdx-bundler";
import path from "path";
import { getInitDataFromS3 } from "@/lib/getInitData";

import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";
import { useCallback } from "react";

export default async function WriterWrapper({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);
  console.log(session);
  // if (!session || !session.user) {
  //   return <SignIn />
  // } else {
  // const epoch: number | null = await initNewPost();
  const s3 = initS3Client();
  const { compiledPosts } = await getInitDataFromS3();
  console.log(`slug`);
  console.log(params.slug);
  const epoch =
    params.slug === "new" ? await initNewPost() : Number(params.slug);
  const post = compiledPosts.find((p) => p.epoch === epoch);
  console.log(2222);
  console.log(post);
  const imageSizes = await getImagesSizes(s3, epoch as number);
  const initialMdx = `---
title: "Trying out new custom code blocks"
category: "News"
thumbnail: ""
date: "2021-11-02"
epoch: "${epoch}"
description: "A great way to display your code snippets on your MDX+Gatsby blog."
---

Here's an example of my new custom code blocks:

\`\`\`JSX
// here's a button in React!
<button
  onClick={() => {
    alert("Hello MDX!");
  }}
>
  test
</button>
\`\`\`

Wow! Such code snippets!
Let's see another, with line highlighting:

\`\`\`JS
// fizzbuzz in JS
for (let i = 1; i <= 100; i++) {
  let out = "";
  if (i % 3 === 0) out += "Fizz";
  if (i % 5 === 0) out += "Buzz";
  console.log(out || i);
}
\`\`\`
`;
  const result = !post
    ? await bundleMDX({
        source: initialMdx,
        mdxOptions(options, frontmatter) {
          options.remarkPlugins = [
            remarkGfm,
            remarkMath,
            remarkFrontmatter,
            remarkMdxFrontmatter,
          ];
          options.rehypePlugins = [rehypeMdxCodeProps, rehypeKatex];

          return options;
        },
      })
    : post;
  const { code, frontmatter, mdx } = {
    ...result,
    mdx: !post ? initialMdx : post.postAsMdx,
  };
  return (
    <Writer
      epoch={epoch}
      imageSizes={imageSizes as IImageSizes}
      initialCompiledMdxInfo={{ code, frontmatter, mdx }}
    />
  );
}

{
  /* <div className="w-80">
          <pre className="w-8">{JSON.stringify(session, null, 2)}</pre>
        </div> */
}