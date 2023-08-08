import { GetObjectCommand, S3Client, _Object } from "@aws-sdk/client-s3";
import listFiles from "./listFiles";

const getNotSavedPostWithImageSizes = async (s3: S3Client) => {
  const allFiles = (await listFiles(s3, "posts/")) as _Object[];
  const dirs: {
    [key: string]: "EXISTS" | undefined;
  } = {};
  allFiles.reduce((acc, currFile) => {
    if (acc[currFile.Key?.split("/")[1] as string] !== undefined) {
      acc[currFile.Key?.split("/")[1] as string] = "EXISTS";
    }
    return acc;
  }, dirs);

  const incompleteEpoch = allFiles
    .find((file) => dirs[file.Key?.split("/")[1] as string] === undefined)
    ?.Key?.split("/")[1] as string;

  return {
    epoch: incompleteEpoch,
    imageSizes: JSON.parse(
      (await (
        await s3.send(
          new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: `posts/${incompleteEpoch}/imageSizes.json`,
          }),
        )
      ).Body?.transformToString()) as string,
    ),
  };
};

export default getNotSavedPostWithImageSizes;
