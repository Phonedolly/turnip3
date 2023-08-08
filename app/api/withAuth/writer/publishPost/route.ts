import initS3Client from "@/lib/S3";
import {
  CopyObjectCommand,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import matter from "gray-matter";
import { stringify } from "yaml";
import checkMDXExists from "@/lib/checkMDXExists";
import listFiles from "@/lib/listFiles";
import getAllCompiledPostWithImageSizes from "@/lib/getAllCompiledPostWithImageSize";

export async function POST(request: Request) {
  const s3 = initS3Client();
  const posts = await getAllCompiledPostWithImageSizes(s3);
  const formData = await request.formData();
  const epoch = Number(formData.get("epoch"));
  const mdx = formData.get("mdx") as string;
  const { data: _data, content: _content } = matter(mdx);
  const frontmatter = _data as IFrontmatter;
  const content = _content as string;

  let shouldUpdateEpoch = false;
  let shouldUpdateDir = true;
  let oldProperDir;
  let properDir;
  let oldEpoch;
  let newEpochCantidate;
  let properEpoch = epoch;

  /* manage time */
  oldEpoch = frontmatter.epoch;
  newEpochCantidate = Date.now();

  /* about epoch - if current publish is first one and incomplete */
  if (
    frontmatter.complete !== true &&
    (!frontmatter.updateTime || frontmatter.updateTime?.length === 0)
  ) {
    shouldUpdateEpoch = false;
    shouldUpdateDir = false;
    oldProperDir = oldEpoch;
    properDir = oldEpoch;
    properEpoch = oldEpoch;
  } else if (
    /* about epoch - if current publish is complete */
    frontmatter.complete === true &&
    frontmatter.updateTime === undefined
  ) {
    /* first complete publish */
    frontmatter.updateTime = [newEpochCantidate];
    oldProperDir = frontmatter.epoch;

    shouldUpdateDir = true;
    shouldUpdateEpoch = true;
    oldProperDir = oldEpoch;
    properDir = frontmatter.title.replaceAll(/ /g, "_");
    properEpoch = newEpochCantidate;
  } else if (
    frontmatter.complete === true &&
    frontmatter.updateTime !== undefined
  ) {
    /* second or more publish */
    frontmatter.updateTime.push(newEpochCantidate); // update updateTime

    /* get old post */
    const oldPost = posts.find(
      (post) => post.frontmatter.epoch == frontmatter.epoch,
    );

    /* check if mdx exists that has different name, for the case that title is changed.
    if it has different name, delete previous mdx on s3 */
    if (
      oldPost !== undefined &&
      oldPost.frontmatter.title !== frontmatter.title
    ) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME as string,
          Key: `posts/${oldPost.frontmatter.title.replaceAll(
            / /g,
            "_",
          )}/${oldPost.frontmatter.title.replaceAll(/ /g, "_")}.mdx`,
        }),
      );
      shouldUpdateDir = true; // already updated
      shouldUpdateEpoch = false;
      oldProperDir = oldPost.frontmatter.title.replaceAll(/ /g, "_");
      properDir = frontmatter.title.replaceAll(/ /g, "_");
      properEpoch = frontmatter.epoch;
    } else {
      /* title has not changed */
      shouldUpdateDir = false;
      shouldUpdateEpoch = false;
      oldProperDir = frontmatter.title.replaceAll(/ /g, "_");
      properDir = oldProperDir;
      properEpoch = frontmatter.epoch;
    }
  }

  /* update mdx with new frontmatter */
  const newMDX = `---\r\n${stringify(
    { ...frontmatter, epoch: properEpoch },
    {
      defaultStringType: "QUOTE_DOUBLE",
      lineWidth: 0,
    },
  )}---\r\n${content}`;

  /* upload mdx loc */
  const result = await s3
    .send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Body: newMDX,
        Key: `posts/${properDir}/${properDir}.mdx`,
      }),
    )
    .then((res) => ({
      success: true,
    }))
    .catch((errReason) => {
      console.error(errReason);
      return { success: false };
    });
  if (!result.success) {
    return NextResponse.json({ success: false }, { status: 500 });
  }

  if (shouldUpdateDir === true) {
    const fileList = await listFiles(s3, `posts/${oldProperDir}/`);
    /* copy files */
    await Promise.all(
      fileList.map(
        (file) =>
          new Promise<CopyObjectCommandOutput>(async (resolve) => {
            const result = await s3.send(
              new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME as string,
                CopySource: file.Key,
                Key: `${file.Key?.replace(oldProperDir, String(properDir))}`,
              }),
            );
            resolve(result);
          }),
      ),
    );

    /* delete original files */
    await Promise.all(
      fileList.map(
        (file) =>
          new Promise<DeleteObjectCommandOutput>(async (resolve) => {
            const result = await s3.send(
              new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: file.Key,
              }),
            );
          }),
      ),
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
