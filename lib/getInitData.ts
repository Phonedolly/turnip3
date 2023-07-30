import { cache } from "react";
import { getAllPosts, getConfig, getEpoches, initS3 } from "./S3";
import { compileMdx } from "./mdx";

export const getInitDataFromS3 = cache(async () => {
  const bucket = process.env.S3_BUCKET_NAME as string;
  const s3 = initS3();

  /* retrieve data */
  const config = await getConfig(s3, bucket);

  const categories = config.categories;
  const postKeys = await getEpoches(s3, bucket);
  const posts = await getAllPosts(s3, bucket);

  /* compile posts */
  const compiledPosts = (await Promise.all(
    posts.map(
      (post) =>
        new Promise(async (resolve) => {
          const compiledPost = await compileMdx(post.post);
          resolve({ compiledPost, originalPost: post.post, epoch: post.epoch });
        }),
    ),
  )) as {
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
    };
  }[];
  return { config, postKeys, posts, compiledPosts, categories };
});
