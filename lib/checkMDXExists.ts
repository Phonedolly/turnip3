import { S3Client, _Object } from "@aws-sdk/client-s3";
import listFiles from "./listFiles";

const checkMDXExists = (s3: S3Client, epoch: number) =>
  new Promise<_Object | undefined>(async (resolve, reject) => {
    /* check if mdx file exists */
    const filesInEachEpoch = listFiles(s3, `posts/${epoch}/`);
    const mdx = (await filesInEachEpoch).find(
      (fileInEachEpoch) => fileInEachEpoch.Key?.endsWith(".mdx"),
    );
    if (!mdx) {
      return reject();
    }
    return mdx;
  });

export default checkMDXExists;
