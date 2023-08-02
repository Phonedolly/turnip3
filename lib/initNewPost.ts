import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { initS3Client } from "./S3";
import { getEpoches } from "./getEpoches";
import { listS3Files } from "./listFiles";

const shouldMakeNewEpoch = async (s3: S3Client) => {
  const epoches = await getEpoches(s3);
  if (epoches.length === 0) {
    return true;
  }
  epoches.sort((a, b) => a - b);
  const objectListInLastEpoch = await listS3Files(
    s3,
    `posts/${epoches[epoches.length - 1]}`,
  );
  const tryToGetMdx = await s3
    .send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `posts/${epoches[epoches.length - 1]}/${
          epoches[epoches.length - 1]
        }.mdx`,
      }),
    )
    .catch((errReason) => {
      console.error("MDX Not Found!");
      return null;
    });
  if (!tryToGetMdx) {
    console.log(
      `shouldMakeNewEpoch: false, lastEpoch: ${epoches[epoches.length - 1]}`,
    );
    return false;
  } else {
    console.log(
      `shouldMakeNewEpoch: true, lastEpoch: ${epoches[epoches.length - 1]}`,
    );
    return true;
  }
};

const initNewPost = async () => {
  const s3 = initS3Client();
  if (!(await shouldMakeNewEpoch(s3))) {
    const epoches = await getEpoches(s3);
    epoches.sort((a, b) => a - b);
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
