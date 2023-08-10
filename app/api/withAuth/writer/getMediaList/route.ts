import initS3Client from "@/lib/S3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import fileToArrayBuffer from "file2arraybuffer";
import { MediaInfo } from "@/types/MediaListWithObjectUrl";
import listS3Files from "@/lib/listFiles";
import getAllCompiledPostWithImageSizes from "@/lib/getAllCompiledPostWithImageSize";
import getMediaList from "@/lib/getMediaList";

export async function GET(request: Request) {
  const s3 = initS3Client();
  const url = new URL(request.url);
  const epoch = Number(url.searchParams.get("epoch"));
  const files = await getMediaList(s3, epoch);
  return NextResponse.json({ files });
}
