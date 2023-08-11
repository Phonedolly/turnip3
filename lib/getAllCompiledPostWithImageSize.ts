import { cache } from "react";
import createPostDir from "./createPostDir";
import { GetObjectCommand, S3Client, _Object } from "@aws-sdk/client-s3";
import listFiles from "./listFiles";
import compileMDX from "./compileMDX";
import getImagesSizes from "./getImageSizes";
import { ICompileMDXOutput } from "@/types/ICompileMDXOutput";
import { specialCharToEscape } from "./manageSpecialChar";

const getAllCompiledPostWithImageSizes = cache(async (s3: S3Client) => {
  const allFiles = (await listFiles(s3, "posts/")) as _Object[];
  const setOfMDXWithoutBody = allFiles.filter(
    (file) => file.Key?.endsWith(".mdx"),
  );
  if (allFiles.length === 0) {
    console.error("posts directory not found. Trying to create the directory.");
    createPostDir(s3)
      .then((res) => {
        console.log("Successfully created posts directory");
      })
      .catch(() => {
        console.error("Trying to create posts directory failed!");
      });
  }

  const frontmatterSet = Promise.all(
    setOfMDXWithoutBody.map(async (mdxWithoutBody) => {
      const result = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME as string,
          Key: mdxWithoutBody.Key,
        }),
      );
      const mdx = (await result.Body?.transformToString()) as string;
      const compiledPost = await compileMDX(mdx);
      return {
        ...compiledPost,
        mdx,
      };
    }),
  );

  const allCompiledPost = (await frontmatterSet).sort((a, b) => {
    return b.frontmatter.epoch - a.frontmatter.epoch;
  }); // sort by epoch, descending order

  const allCompiledPostWithImageSizes = (
    await Promise.all(
      allCompiledPost.map(
        (compiledPost) =>
          new Promise<
            ICompileMDXOutput & { mdx: string } & { imageSizes: IImageSize }
          >(async (resolve) => {
            const imageSizes = (await getImagesSizes(
              s3,
              compiledPost.frontmatter.complete === true
                ? specialCharToEscape(compiledPost.frontmatter.title)
                : compiledPost.frontmatter.epoch,
            )) as IImageSize;

            return resolve({ ...compiledPost, imageSizes });
          }),
      ),
    )
  ).sort((a, b) => {
    return b.frontmatter.epoch - a.frontmatter.epoch;
  });

  return allCompiledPostWithImageSizes;
});

export default getAllCompiledPostWithImageSizes;
