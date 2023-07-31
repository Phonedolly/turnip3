import {
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { initS3Client } from "./S3";
import { getEpoches } from "./getEpoches";
import { listS3Files } from "./listFiles";

const shouldMakeNewEpoch = async (s3: S3Client) => {
  const epoches = await getEpoches(s3);
  epoches.sort();
  const objectListInLastEpoch = await listS3Files(
    s3,
    `posts/${epoches[epoches.length - 1]}`,
  );
  if (
    (objectListInLastEpoch.length === 1 &&
      objectListInLastEpoch[0].Key ===
        `posts/${epoches[epoches.length - 1]}/imageSizes.json`) ||
    objectListInLastEpoch.length === 0
  ) {
    return false;
  } else {
    return true;
  }
};

const initNewPost = async () => {
  const s3 = initS3Client();
  if (!(await shouldMakeNewEpoch(s3))) {
    const epoches = await getEpoches(s3);
    epoches.sort();
    return epoches[epoches.length - 1];
  }

  const epoch = Date.now();
  const paramsForDir = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: `posts/${epoch}/`,
  };
  const putObjectCommandForDir = new PutObjectCommand(paramsForDir);
  await s3.send(putObjectCommandForDir);

  const paramsForDelimiter = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: `posts/${epoch}`,
  };
  const putObjectCommandForDelimiter = new PutObjectCommand(paramsForDelimiter);
  await s3.send(putObjectCommandForDelimiter);

  return epoch;
};

export default initNewPost;
