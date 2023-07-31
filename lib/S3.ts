import { cache } from "react";
import "server-only";
import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  ListObjectsV2CommandOutput,
  _Object,
} from "@aws-sdk/client-s3";
import getImagesSizes from "./getImageSizes";

export const initS3 = () => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    region: process.env.S3_REGION as string,
  });

  return s3;
};

export const listS3Files = async (
  s3: S3Client,
  bucket: string,
  prefix: string,
) => {
  const params: {
    Bucket: string;
    Prefix: string;
    MaxKeys?: number;
    ContinuationToken?: string;
  } = {
    Bucket: bucket,
    Prefix: prefix,
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

export const getEpoches = cache(async (s3: S3Client, bucket: string) => {
  const epochKeys = await listS3Files(s3, bucket, "posts/");
  if (epochKeys.length === 0) {
    console.error("posts directory not found. Trying to create the directory.");
    createPostDir(s3, bucket)
      .then((res) => {
        console.log("Successfully created posts directory");
        console.log(res);
      })
      .catch(() => {
        console.error("Trying to create posts directory failed!");
      });
  }
  epochKeys.shift(); // remove directory name
  const epochesAsNumber = epochKeys
    .filter((postKey) => postKey.Key?.endsWith("/"))
    .map((postKey) =>
      Number(postKey.Key?.replace("posts/", "").replace("/", "")),
    );

  return epochesAsNumber;
});

export const getAllPosts = async (s3: S3Client, bucket: string) => {
  const epoches = await getEpoches(s3, bucket);
  const promises = epoches.map(
    (epoch) =>
      new Promise(async (resolve) => {
        const command = new GetObjectCommand({
          Bucket: bucket,
          Key: `posts/${epoch}/${epoch}.mdx`,
        });
        const response = await s3.send(command).catch(() => undefined);
        if (response === undefined) {
          return resolve({ post: null, epoch });
        }
        const post = (await response?.Body?.transformToString()) as string;

        const imageSizes = (await getImagesSizes(s3, epoch)) as IImageSizes;

        resolve({ post, epoch, imageSizes });
      }),
  );
  const posts = (
    (await Promise.all(promises)) as { post: string | null; epoch: number }[]
  ).filter((post) => post.post !== null) as { post: string; epoch: number }[];

  return posts;
};

export const getConfig = async (s3: S3Client, bucket: string) => {
  /* retrieve config.json */
  const params = {
    Bucket: bucket,
    Key: "config.json",
  };
  const command = new GetObjectCommand(params);
  const response = await s3.send(command);
  const rawConfigString = (await response.Body?.transformToString()) as string;
  return JSON.parse(rawConfigString) as Config;
};

const createPostDir = async (s3: S3Client, bucket: string) => {
  const params = {
    Bucket: bucket,
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
