import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import initS3Client from "./S3";
import listS3Files from "./listFiles";
import getAllCompiledPostWithImageSizes from "./getAllCompiledPostWithImageSize";
import listFiles from "./listFiles";
import { createImageSizes } from "./getImageSizes";

const checkShouldMakeNewEpoch = async (s3: S3Client) => {
  const getImageSizesList = (await listFiles(s3, "posts/")).filter(
    (file) => file.Key?.split("/")[2] === "imageSizes.json",
  );
  if (getImageSizesList.length === 0) {
    return {
      containingOnlyImageSizesExists: false,
      thatEpoch: null,
    };
  }
  const epochContainingOnlyImageSizes = (
    await Promise.all(
      getImageSizesList.map(
        (eachImageSizes) =>
          new Promise<{
            onlyImageSizesExists: boolean;
            thatTitleOrEpoch?: number | string;
          }>((resolve) => {
            const _titleOrEpoch = eachImageSizes.Key?.split("/")[1] as string;
            const titleOrEpoch = Number.isNaN(Number(_titleOrEpoch))
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
                  thatTitleOrEpoch: titleOrEpoch,
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
        ? epochContainingOnlyImageSizes[0].thatTitleOrEpoch
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
