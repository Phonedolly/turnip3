import { PutObjectCommand } from "@aws-sdk/client-s3";
import { initS3 } from "./S3";

const initNewPost = async () => {
  const s3 = await initS3();
  const epoch = Date.now();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: `posts/${epoch}/`,
  };
  const putObjectCommand = new PutObjectCommand(params);

  return await s3
    .send(putObjectCommand)
    .then(() => epoch)
    .catch((errReason) => {
      console.log(errReason);
      return null;
    });
};

export default initNewPost;
