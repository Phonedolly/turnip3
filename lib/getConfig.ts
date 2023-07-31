import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const getConfig = async (s3: S3Client) => {
  /* retrieve config.json */
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: "config.json",
  };
  const command = new GetObjectCommand(params);
  const response = await s3.send(command);
  const rawConfigString = (await response.Body?.transformToString()) as string;
  return JSON.parse(rawConfigString) as IConfig;
};
