import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { cache } from "react";

const checkImageSizesConfigExists = cache(
  async (s3: S3Client, epoch: number) => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `posts/${epoch}/imageSizes.json`,
    };
    return await s3
      .send(new GetObjectCommand(params))
      .then(() => true)
      .catch(() => false);
  },
);

const getImagesSizes = cache(async (s3: S3Client, epoch: number) => {
  let res;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `posts/${epoch}/imageSizes.json`,
  };

  const isImageSizesCopnfigExists = await checkImageSizesConfigExists(
    s3,
    epoch,
  );

  if (!isImageSizesCopnfigExists) {
    res = await s3.send(
      new PutObjectCommand({
        ...params,
        Body: JSON.stringify({} as IImageSizes),
      }),
    );
  }

  return (
    await s3.send(new GetObjectCommand(params))
  ).Body?.transformToString().then((body) => JSON.parse(body) as IImageSizes);
});

export default getImagesSizes;
