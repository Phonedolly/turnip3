import { cache } from "react";

import { createPostDir } from "./createPostDir";
import { S3Client, _Object } from "@aws-sdk/client-s3";
import { listS3Files } from "./listFiles";

export const getEpoches = async (s3: S3Client) => {
  const epochKeys = (await listS3Files(s3, "posts/", "/")) as _Object[];
  if (epochKeys.length === 0) {
    console.error("posts directory not found. Trying to create the directory.");
    createPostDir(s3)
      .then((res) => {
        console.log("Successfully created posts directory");
        console.log(res);
      })
      .catch(() => {
        console.error("Trying to create posts directory failed!");
      });
  }
  console.log("origin");
  console.log(epochKeys);
  epochKeys.shift(); // remove directory name

  /* manipluate the keys to number epoches */
  console.log("epoch");
  console.log(epochKeys);
  const epochesAsNumber = epochKeys.map((postKey) =>
    Number(postKey.Key?.replace("posts/", "")),
  );

  return epochesAsNumber;
};
