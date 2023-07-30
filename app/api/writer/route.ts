import { initS3 } from "@/lib/S3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import fileToArrayBuffer from "file2arraybuffer";

const s3 = initS3();

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const fileName = formData.get("name") as string;

  const readFileAsBlob = (file: Blob) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
  };

  const fileAsArrayBuffer = await fileToArrayBuffer(file);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Body: fileAsArrayBuffer,
    Key: `posts/${fileName}`,
  };
  const putObjectCommand = new PutObjectCommand(params);

  return s3
    .send(putObjectCommand)
    .then(() => NextResponse.json({ success: true }))
    .catch((errReason) => {
      console.log(errReason);
      NextResponse.json({ success: false, errReason });
    });
}
