import { cache } from "react";
import { initS3Client } from "./S3";
import { compileMdx, compileMdxSyncCompiledOnly } from "./mdx";
import MDXComponents from "@/components/MDXComponents";
import getImagesSizes from "./getImageSizes";
import { MDXContent } from "mdx/types";
import { getConfig } from "./getConfig";
import { getEpoches } from "./getEpoches";
import { getAllPosts } from "./getAllPosts";

export const getInitDataFromS3 = cache(async () => {
  const bucket = process.env.S3_BUCKET_NAME as string;
  const s3 = initS3Client();

  /* retrieve data */
  const config = await getConfig(s3);

  const categories = config.categories;
  const postKeys = await getEpoches(s3);
  const posts = await getAllPosts(s3);

  /* compile posts */
  const compiledPosts = (await Promise.all(
    posts.map(
      (post) =>
        new Promise(async (resolve) => {
          const compiledPost = compileMdxSyncCompiledOnly(post.post);
          const compiledPostWithImageSizes = {
            ...compiledPost,
            contentWithImageSizes: compiledPost.compiledMdx({
              components: MDXComponents(
                (await getImagesSizes(s3, post.epoch)) as IImageSizes,
              ),
            }),
          };
          resolve({
            ...compiledPostWithImageSizes,
            originalPost: post.post,
            epoch: post.epoch,
          });
        }),
    ),
  )) as {
    originalPost: string;
    epoch: number;
    contentWithImageSizes: JSX.Element;
    compiledMdx: MDXContent;
    frontmatter: {
      epoch: number;
      constructor: Function;
      toString(): string;
      toLocaleString(): string;
      valueOf(): Object;
      hasOwnProperty(v: PropertyKey): boolean;
      isPrototypeOf(v: Object): boolean;
      propertyIsEnumerable(v: PropertyKey): boolean;
    };
  }[];
  return { config, postKeys, posts, compiledPosts, categories };
});
