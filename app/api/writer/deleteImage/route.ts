import initS3Client from "@/lib/S3";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import fileToArrayBuffer from "file2arraybuffer";
import { MediaListWithObjectUrl } from "@/types/MediaListWithObjectUrl";

const s3 = initS3Client();

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
  const key = url.searchParams.get("key");

  if (!key) {
    return NextResponse.json({ success: false });
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: key as string,
  };

  const deleteObjectCommand = new DeleteObjectCommand(params);

  return s3
    .send(deleteObjectCommand)
    .then(() => NextResponse.json({ success: true }))
    .catch((errReason) => {
      console.error("Failed to Delete Object!");
      console.error(errReason);
      NextResponse.json(errReason);
    });
}
