import Writer from "@/components/Writer";
import getImagesSizes from "@/lib/getImageSizes";
import initS3Client from "@/lib/S3";
import { bundleMDX } from "mdx-bundler";
import getInitDataFromS3 from "@/lib/getInitData";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";
import initNewPost from "@/lib/initNewPost";
import compileMDX from "@/lib/compileMDX";
import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";
import getMediaList from "@/lib/getMediaList";

export default async function WriterWrapper({
  params,
}: {
  params: { slug: string };
}) {
  // if (!session || !session.user) {
  //   return <SignIn />
  // } else {
  // const epoch: number | null = await initNewPost();
  const s3 = initS3Client();
  const { posts, categories } = await getInitDataFromS3();
  const incompletePosts = posts.filter(
    (compiledPost) => compiledPost.frontmatter.complete !== true,
  );
  if (params.slug === "new" || Number.isNaN(params.slug)) {
    redirect(`/writer/${await initNewPost()}`, RedirectType.replace);
  }
  const epoch = Number(params.slug);
  const post = posts.find((p) => p.frontmatter.epoch === epoch);
  const titleOrEpoch =
    post?.frontmatter.complete === true
      ? post?.frontmatter.title
      : post
      ? (post?.frontmatter.epoch as string | number)
      : epoch;
  const imageSizes = await getImagesSizes(s3, titleOrEpoch);
  const initialMediaList = await getMediaList(s3, epoch);
  const initialMdx = `---
title: "Trying out new custom code blocks"
category: "News"
thumbnail: ""
epoch: ${epoch}
description: "A great way to display your code snippets on your MDX+Gatsby blog."
complete: false
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
  const result = !post ? await compileMDX(initialMdx) : post;
  const { code, frontmatter, mdx } = {
    ...result,
    mdx: !post ? initialMdx : post.mdx,
  };
  return (
    <Writer
      epoch={epoch}
      imageSizes={imageSizes as IImageSizes}
      initialCompiledMdxInfo={{ code, frontmatter, mdx }}
      initialMediaList={initialMediaList}
      imcompletePosts={incompletePosts.map((p) => ({
        title: p.frontmatter.title,
        epoch: p.frontmatter.epoch,
      }))}
    />
  );
}

{
  /* <div className="w-80">
          <pre className="w-8">{JSON.stringify(session, null, 2)}</pre>
        </div> */
}
