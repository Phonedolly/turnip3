import { cache } from "react";
import { initS3Client } from "./S3";
import { getConfig } from "./getConfig";
import { getAllPosts } from "./getAllPosts";
import { bundleMDX } from "mdx-bundler";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeKatex from "rehype-katex";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

export const getInitDataFromS3 = async () => {
  const bucket = process.env.S3_BUCKET_NAME as string;
  const s3 = initS3Client();

  /* retrieve data */
  const config = await getConfig(s3);

  const categories = config.categories;
  const posts = await getAllPosts(s3);

  /* compile posts */
  const compiledPosts = (await Promise.all(
    posts.map(
      (post) =>
        new Promise(async (resolve, reject) => {
          const result = await bundleMDX({
            source: post.postAsMdx,
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
            .then((result) => result)
            .catch((errReason) => {
              console.error("Compile Error!");
              console.error(errReason);
              return reject(false);
            });
          resolve({
            ...post,
            code: result?.code,
            frontmatter: result?.frontmatter,
          });
        }),
    ),
  )) as {
    postAsMdx: string;
    epoch: number;
    imageSizes: IImageSizes;
    code: string;
    frontmatter: {
      [key: string]: any;
    };
  }[];
  return { config, compiledPosts, categories };
};
