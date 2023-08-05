import { cache } from "react";
import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

const initS3Client = cache(() => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    region: process.env.S3_REGION as string,
  });

  return s3;
});

export default initS3Client;
