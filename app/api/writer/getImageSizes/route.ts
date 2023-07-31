import { initS3Client } from "@/lib/S3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import fileToArrayBuffer from "file2arraybuffer";
import path from "path";
import { subClass } from "gm";
import getImagesSizes from "@/lib/getImageSizes";
const im = subClass({ imageMagick: "7+" });

export async function GET(request: Request) {
  const s3 = initS3Client();
  const url = new URL(request.url);
  const epoch = Number(url.searchParams.get("epoch"));

  let imageSizes = (await getImagesSizes(s3, epoch)) as IImageSizes;
  return NextResponse.json(imageSizes);
}
