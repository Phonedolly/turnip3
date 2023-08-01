import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getEpoches } from "./getEpoches";
import getImagesSizes from "./getImageSizes";

export const getAllPosts = async (s3: S3Client) => {
  const epoches = await getEpoches(s3);
  console.log(epoches);
  console.log("epoches");
  const promises = epoches.map(
    (epoch) =>
      new Promise(async (resolve, reject) => {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `posts/${epoch}/${epoch}.mdx`,
        });
        const response = await s3.send(command).catch((err) => {
          console.error("response.body");
          console.error(err);
          return reject(err);
        });
        if (!response?.Body) {
          return;
        }
        const postAsMdx = (await response.Body.transformToString()) as string;
        console.log(epoch);

        const imageSizes = (await getImagesSizes(s3, epoch)) as IImageSizes;

        return resolve({ postAsMdx, epoch, imageSizes });
      }),
  );

  const posts = await Promise.allSettled(promises).then((res) =>
    res.reduce(
      (
        acc: { postAsMdx: string; epoch: number; imageSizes: IImageSizes }[],
        curr,
      ) => {
        if (curr.status === "fulfilled") {
          acc.push(
            curr.value as {
              postAsMdx: string;
              epoch: number;
              imageSizes: IImageSizes;
            },
          );
        }
        return acc;
      },
      [],
    ),
  );

  return posts;
};