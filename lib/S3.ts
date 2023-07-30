import { cache } from "react";
import "server-only";
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  PutObjectCommand,
  ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";
import { compileMdx } from "./mdx";

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

const listS3Files = async (s3: S3Client, bucket: string, prefix: string) => {
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
  const keys: (string | undefined)[] = [];
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
        keys.push(item.Key);
      });
    }
    if (!IsTruncated || !NextContinuationToken) {
      cycle = false;
    }
    params.ContinuationToken = NextContinuationToken;
  }
  return keys;
};

const getPostKeys = cache(async (s3: S3Client, bucket: string) => {
  const postKeys = await listS3Files(s3, bucket, "posts/");
  if (!postKeys) {
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
  postKeys.shift(); // remove directory name

  return postKeys;
});

const getAllPosts = async (s3: S3Client, bucket: string) => {
  const postKeys = await getPostKeys(s3, bucket);

  const promises = postKeys.map(
    (postKey) =>
      new Promise(async (resolve) => {
        const command = new GetObjectCommand({ Bucket: bucket, Key: postKey });
        const response = await s3.send(command);
        const post = (await response.Body?.transformToString()) as string;
        resolve(post);
      }),
  );
  const posts = (await Promise.all(promises)) as string[];

  return posts;
};

const getConfig = async (s3: S3Client, bucket: string) => {
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

export const getDataFromS3 = cache(async () => {
  const bucket = process.env.S3_BUCKET_NAME as string;
  const s3 = initS3();

  /* retrieve data */
  const config = await getConfig(s3, bucket);

  const categories = config.categories;
  const postKeys = await getPostKeys(s3, bucket);
  const posts = await getAllPosts(s3, bucket);

  /* compile posts */
  const compiledPosts = (await Promise.all(
    posts.map(
      (post) =>
        new Promise(async (resolve) => {
          const compiledPost = await compileMdx(post);
          resolve(compiledPost);
        }),
    ),
  )) as {
    content: JSX.Element;
    frontmatter: {
      title?: string | undefined;
      category?: string | undefined;
      thumbnail: string;
      epoch: number;
      date?: string | undefined;
      description?: string | undefined;
    };
  }[];

  return { config, postKeys, posts, compiledPosts, categories };
});
