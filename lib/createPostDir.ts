import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const createPostDir = async (s3: S3Client) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: "posts/",
  };
  const command = new PutObjectCommand(params);
  const response = await s3.send(command);
  if (response.RequestCharged) {
    return Promise.resolve(response.RequestCharged);
  } else {
    return Promise.reject();
  }
};
