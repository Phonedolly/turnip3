import {
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  S3Client,
  _Object,
} from "@aws-sdk/client-s3";

export const listS3Files = async (
  s3: S3Client,
  prefix: string,
  delimiter?: string,
) => {
  const params: {
    Bucket: string;
    Prefix: string;
    Delimiter?: string;
    MaxKeys?: number;
    ContinuationToken?: string;
  } = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Prefix: prefix,
    Delimiter: delimiter,
    // MaxKeys: 1000,
  };
  let cycle = true;
  const keys: _Object[] = [];
  while (cycle) {
    const data = (await s3
      .send(new ListObjectsV2Command(params))
      .catch((err) => {
        console.error("Failed to send ListObjectsV2Command!");
        console.error(err);
      })) as ListObjectsV2CommandOutput;
    const { Contents, IsTruncated, NextContinuationToken } = data;
    if (Contents) {
      Contents.forEach((item) => {
        if (!item) {
          return;
        }
        keys.push(item);
      });
    }
    if (!IsTruncated || !NextContinuationToken) {
      cycle = false;
    }
    params.ContinuationToken = NextContinuationToken;
  }
  return keys;
};
