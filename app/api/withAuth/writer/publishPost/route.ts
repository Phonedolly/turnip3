import initS3Client from "@/lib/S3";
import {
  CopyObjectCommand,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import matter from "gray-matter";
import { stringify } from "yaml";
import checkMDXExists from "@/lib/checkMDXExists";
import listFiles from "@/lib/listFiles";
import getAllCompiledPostWithImageSizes from "@/lib/getAllCompiledPostWithImageSize";
import { specialCharToEscape } from "@/lib/manageSpecialChar";

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
    /* check title or epoch is duplicated */
    const exsitingTitleAndEpochs = await Promise.all(
      (await listFiles(s3, `posts/`))
        .filter((file) => file.Key?.split("/")[2]?.endsWith(".mdx"))
        .filter(
          (file) =>
            file.Key?.split("/")[2] !== `${frontmatter.title}.mdx` &&
            file.Key?.split("/")[2] !== `${frontmatter.epoch}.mdx`,
        )
        .map(
          (file) =>
            new Promise<{ title: string; epoch: number }>(async (resolve) => {
              return await s3
                .send(
                  new GetObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: file.Key,
                  }),
                )
                .then(async (res) => {
                  const { data: _existingData } = matter(
                    (await res.Body?.transformToString()) as string,
                  );
                  const existingFrontmatter = _existingData as IFrontmatter;
                  return resolve({
                    title: existingFrontmatter.title,
                    epoch: existingFrontmatter.epoch,
                  });
                });
            }),
        ),
    );

    const isDuplicateTitleOrEpoch =
      exsitingTitleAndEpochs.filter(
        (exsitingTitleAndEpoch) =>
          exsitingTitleAndEpoch.epoch === frontmatter.epoch,
      ).length > 0;

    if (isDuplicateTitleOrEpoch) {
      return NextResponse.json(
        { success: false, reason: "duplicate title or epoch" },
        { status: 500 },
      );
    }

    frontmatter.updateTime = [newEpochCantidate];
    oldProperDir = frontmatter.epoch;

    shouldUpdateDir = true;
    shouldUpdateEpoch = true;
    oldProperDir = oldEpoch;
    properDir = specialCharToEscape(frontmatter.title);
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
          )}/${specialCharToEscape(oldPost.frontmatter.title)}.mdx`,
        }),
      );
      shouldUpdateDir = true; // already updated
      shouldUpdateEpoch = false;
      oldProperDir = specialCharToEscape(oldPost.frontmatter.title);
      properDir = specialCharToEscape(frontmatter.title);
      properEpoch = frontmatter.epoch;
    } else {
      /* title has not changed */
      shouldUpdateDir = false;
      shouldUpdateEpoch = false;
      oldProperDir = specialCharToEscape(frontmatter.title);
      properDir = oldProperDir;
      properEpoch = frontmatter.epoch;
    }
  }

  /* update mdx with new frontmatter */
  const imageURLReplacedFrontmatter = {
    ...frontmatter,
    thumbnail: frontmatter.thumbnail.replace(oldProperDir, properDir),
  };
  const imageURLReplacedContent = content.replaceAll(oldProperDir, properDir);

  const newMDX = `---\r\n${stringify(
    { ...imageURLReplacedFrontmatter, epoch: properEpoch },
    {
      defaultStringType: "QUOTE_DOUBLE",
      lineWidth: 0,
    },
  )}---\r\n${imageURLReplacedContent}`;

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
    const fileList = await listFiles(s3, `posts/${oldProperDir}/`, "/");
    /* copy files */
    await Promise.all(
      fileList.map(
        (file) =>
          new Promise<CopyObjectCommandOutput>(async (resolve) => {
            const result = await s3.send(
              new CopyObjectCommand({
                CopySource: encodeURI(
                  `${process.env.S3_BUCKET_NAME}/${file.Key}`,
                ), // SOURCE_BUCKET/SOURCE_OBJECT_KEY
                Bucket: process.env.S3_BUCKET_NAME as string, // DESTINATION_BUCKET
                Key: `${file.Key?.replace(oldProperDir, String(properDir))}`,
              }),
            );
            return resolve(result);
          }),
      ),
    );

    /* delete original files and original mdx on new dir */
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Delete: {
          Objects: fileList
            .map((file) => ({ Key: file.Key }))
            .concat({ Key: `posts/${properDir}/${oldProperDir}.mdx` }),
        },
      }),
    );
    // await Promise.all(
    //   fileList.map(
    //     (file) =>
    //       new Promise<DeleteObjectCommandOutput>(async (resolve) => {
    //         const result = await s3.send(
    //           new DeleteObjectCommand({
    //             Bucket: process.env.S3_BUCKET_NAME,
    //             Key: file.Key,
    //           }),
    //         );
    //         resolve(result);
    //       }),
    //   ),
    // );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
