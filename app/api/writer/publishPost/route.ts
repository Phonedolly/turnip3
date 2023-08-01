import { initS3Client } from "@/lib/S3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const s3 = initS3Client();
  const formData = await request.formData();
  const epoch = Number(formData.get("epoch"));
  const mdx = formData.get("mdx") as string;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Body: mdx as string,
    Key: `posts/${epoch}/${epoch}.mdx`,
  };
  const putObjectCommand = new PutObjectCommand(params);

  return s3
    .send(putObjectCommand)
    .then((res) => NextResponse.json(res, { status: 200 }))
    .catch((errReason) => {
      console.error(errReason);
      NextResponse.json({ success: false, errReason }, { status: 500 });
    });
}