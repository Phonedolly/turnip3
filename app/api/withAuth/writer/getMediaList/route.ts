import initS3Client from "@/lib/S3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import fileToArrayBuffer from "file2arraybuffer";
import { MediaListWithObjectUrl } from "@/types/MediaListWithObjectUrl";
import listS3Files from "@/lib/listFiles";
import getAllCompiledPostWithImageSizes from "@/lib/getAllCompiledPostWithImageSize";

export async function GET(request: Request) {
  const s3 = initS3Client();
  const url = new URL(request.url);
  const epoch = Number(url.searchParams.get("epoch"));
  const posts = await getAllCompiledPostWithImageSizes(s3);
  const identity = posts.find((post) => post.frontmatter.epoch === epoch);
  let dirName: string | number = identity?.frontmatter.complete === true ? identity?.frontmatter.title as string : identity?.frontmatter.epoch;

  if (!identity) {
    dirName = epoch;
  }
  const files = (await listS3Files(s3, `posts/${dirName}/`)).map((media) => ({
    ...media,
    objectUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${media.Key}`,
  })) as unknown as MediaListWithObjectUrl;

  return NextResponse.json({ files });
}
