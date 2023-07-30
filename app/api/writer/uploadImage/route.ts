import { initS3 } from "@/lib/S3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import fileToArrayBuffer from "file2arraybuffer";
import path from "path";
import { subClass } from "gm";
const im = subClass({ imageMagick: "7+" });

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

export async function POST(request: Request) {
  const formData = await request.formData();
  const epoch = formData.get("epoch") as string;
  const file = formData.get("file") as File;
  let fileName = formData.get("name") as string;
  fileName = fileName.replaceAll(" ", "_");
  const fileAsArrayBuffer = Buffer.from(await fileToArrayBuffer(file));

  if (await checkFileDuplicated(epoch, fileName)) {
    const { name, ext } = path.parse(fileName);
    fileName = name + "_" + Date.now() + ext; // already ext has '.'
  }

  const imageSize = await new Promise((resolve, reject) => {
    im(fileAsArrayBuffer).size((err, value) => {
      if (err) {
        return reject(err);
      }
      return resolve(value);
    });
  })
    .then((res) => res)
    .catch((errReason) => {
      console.error("failed to get size of image!");
      console.error(errReason);
      return NextResponse.json({ success: false, errReason }, { status: 500 });
    });

  if (imageSize instanceof NextResponse) {
    return imageSize;
  }

  console.log(imageSize);

  const params = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Body: fileAsArrayBuffer,
    Key: `posts/${epoch}/${fileName}`,
  };
  const putObjectCommand = new PutObjectCommand(params);

  return s3
    .send(putObjectCommand)
    .then((res) => NextResponse.json(res))
    .catch((errReason) => {
      console.error(errReason);
      NextResponse.json({ success: false, errReason });
    });
}
