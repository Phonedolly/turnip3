import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getEpoches } from "./getEpoches";
import getImagesSizes from "./getImageSizes";

export const getAllPosts = async (s3: S3Client) => {
  const epoches = await getEpoches(s3);
  const promises = epoches.map(
    (epoch) =>
      new Promise(async (resolve) => {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `posts/${epoch}/${epoch}.mdx`,
        });
        const response = await s3.send(command).catch(() => undefined);
        if (response === undefined) {
          return resolve({ post: null, epoch });
        }
        const post = (await response?.Body?.transformToString()) as string;

        const imageSizes = (await getImagesSizes(s3, epoch)) as IImageSizes;

        resolve({ post, epoch, imageSizes });
      }),
  );
  const posts = (
    (await Promise.all(promises)) as { post: string | null; epoch: number }[]
  ).filter((post) => post.post !== null) as { post: string; epoch: number }[];

  return posts;
};
