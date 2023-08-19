import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import initS3Client from "./S3";
import listFiles from "./listFiles";
import { createImageSizes } from "./getImageSizes";
import { specialCharToEscape } from "./manageSpecialChar";

const checkShouldMakeNewEpoch = async (s3: S3Client) => {
  const imageSizesList = (await listFiles(s3, "posts/")).filter(
    (file) => file.Key?.split("/")[2] === "imageSizes.json",
  );
  if (imageSizesList.length === 0) {
    return {
      containingOnlyImageSizesExists: false,
      thatEpoch: null,
    };
  }
  const epochContainingOnlyImageSizes = (
    await Promise.all(
      imageSizesList.map(
        (eachImageSizes) =>
          new Promise<{
            onlyImageSizesExists: boolean;
            thatEpoch?: number;
          }>((resolve) => {
            const _titleOrEpoch = eachImageSizes.Key?.split("/")[1] as string;
            const titleOrEpoch = isNaN(Number(_titleOrEpoch))
              ? _titleOrEpoch
              : Number(_titleOrEpoch);
            s3.send(
              new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME as string,
                Key: `posts/${titleOrEpoch}/${titleOrEpoch}.mdx`,
              }),
            )
              .then(() => resolve({ onlyImageSizesExists: false })) // unsaved new post
              .catch(() =>
                resolve({
                  onlyImageSizesExists: true,
                  thatEpoch: Number(titleOrEpoch),
                }),
              ); // epoch-only directory not exists
          }),
      ),
    )
  ).filter((res) => res.onlyImageSizesExists === true);
  const containingOnlyImageSizesExists =
    epochContainingOnlyImageSizes.length > 0;

  return {
    containingOnlyImageSizesExists,
    thatEpoch:
      containingOnlyImageSizesExists === true
        ? epochContainingOnlyImageSizes[0].thatEpoch
        : null,
  };
};

const initNewPost = async () => {
  const s3 = initS3Client();
  const shouldMakeNewEpoch = await checkShouldMakeNewEpoch(s3);

  if (
    shouldMakeNewEpoch.containingOnlyImageSizesExists === true &&
    (typeof shouldMakeNewEpoch.thatEpoch === "number" ||
      typeof shouldMakeNewEpoch.thatEpoch === "string")
  ) {
    return shouldMakeNewEpoch.thatEpoch;
  }

  /* create new epoch dir */
  const epoch = Date.now();
  await createImageSizes(s3, epoch);

  return epoch;
};

export default initNewPost;
