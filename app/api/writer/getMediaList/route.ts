import { initS3, listS3Files } from "@/lib/S3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import fileToArrayBuffer from "file2arraybuffer";
import { MediaListWithObjectUrl } from "@/types/MediaListWithObjectUrl";

const s3 = initS3();

const checkFileDuplicated = (epoch: string, fileName: string) => {
  return s3
    .send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: `posts/${epoch}/${fileName}`,
      }),
    )
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const epoch = url.searchParams.get("epoch");
  const files = (
    await listS3Files(
      s3,
      process.env.S3_BUCKET_NAME as string,
      `posts/${epoch}/`,
    )
  ).map((media) => ({
    ...media,
    objectUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${media.Key}`,
  })) as unknown as MediaListWithObjectUrl;

  console.log(files);

  return NextResponse.json({ files });
}
