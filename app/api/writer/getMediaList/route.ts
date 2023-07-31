import { initS3Client } from "@/lib/S3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import fileToArrayBuffer from "file2arraybuffer";
import { MediaListWithObjectUrl } from "@/types/MediaListWithObjectUrl";
import { listS3Files } from "@/lib/listFiles";

export async function GET(request: Request) {
  const s3 = initS3Client();
  const url = new URL(request.url);
  const epoch = url.searchParams.get("epoch");
  const files = (
    await listS3Files(
      s3,
      `posts/${epoch}/`,
    )
  ).map((media) => ({
    ...media,
    objectUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${media.Key}`,
  })) as unknown as MediaListWithObjectUrl;

  console.log(files);

  return NextResponse.json({ files });
}
