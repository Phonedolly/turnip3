import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { cache } from "react";
import { specialCharToEscape } from "./manageSpecialChar";

const checkImageSizesConfigExists = cache(
  async (s3: S3Client, titleOrEpoch: number | string) => {
    const escapedTitleOrEpoch =
      typeof titleOrEpoch === "string"
        ? specialCharToEscape(titleOrEpoch)
        : titleOrEpoch;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `posts/${escapedTitleOrEpoch}/imageSizes.json`,
    };
    return await s3
      .send(new GetObjectCommand(params))
      .then(() => true)
      .catch(() => false);
  },
);

export const createImageSizes = async (
  s3: S3Client,
  titleOrEpoch: number | string,
) => {
  const espacedTitleOrEpoch =
    typeof titleOrEpoch === "string"
      ? specialCharToEscape(titleOrEpoch)
      : titleOrEpoch;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Body: JSON.stringify({} as IImageSize),
      Key: `posts/${espacedTitleOrEpoch}/imageSizes.json`,
    }),
  );
};

const getImagesSizes = async (s3: S3Client, titleOrEpoch: number | string) => {
  const isImageSizesConfigExists = await checkImageSizesConfigExists(
    s3,
    titleOrEpoch,
  );

  // if (!isImageSizesConfigExists) {
  //   await createImageSizes(s3, titleOrEpoch);
  // }

  return (
    await s3.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: `posts/${
          typeof titleOrEpoch === "string"
            ? specialCharToEscape(titleOrEpoch)
            : titleOrEpoch
        }/imageSizes.json`,
      }),
    )
  ).Body?.transformToString().then((body) => JSON.parse(body) as IImageSize);
};

export default getImagesSizes;
