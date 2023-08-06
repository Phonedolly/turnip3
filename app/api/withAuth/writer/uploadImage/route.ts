import initS3Client from "@/lib/S3";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import fileToArrayBuffer from "file2arraybuffer";
import path from "path";
import { subClass } from "gm";
import getImagesSizes from "@/lib/getImageSizes";
// const im = subClass({ imageMagick: true });
import gm from "gm";
// import sharp from "sharp";
import Jimp from "jimp";

const checkFileDuplicated = (s3: S3Client, epoch: number, fileName: string) => {
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

// function getNormalSize({
//   width,
//   height,
//   orientation,
// }: {
//   width: number | undefined;
//   height: number | undefined;
// }) {
//   return (orientation || 0) >= 5
//     ? { width: height, height: width }
//     : { width, height };
// }

export async function POST(request: Request) {
  const s3 = initS3Client();
  const formData = await request.formData();
  const epoch = Number(formData.get("epoch"));
  const numOfFiles = Number(formData.get("numOfFiles"));

  const failedFiles: string[] = [];
  let imageSizes = (await getImagesSizes(s3, epoch)) as IImageSizes;

  for (let i = 0; i < numOfFiles; i++) {
    const file = formData.get(`file_${i}`) as File;
    let fileName = file.name;
    fileName = fileName.replaceAll(" ", "_");
    const fileAsArrayBuffer = Buffer.from(await fileToArrayBuffer(file));

    if (await checkFileDuplicated(s3, epoch, fileName)) {
      const { name, ext } = path.parse(fileName);
      fileName = name + "_" + Date.now() + ext; // already ext has '.'
    }

    /* get image size */
    const imageSize = JSON.parse(formData.get(`file_${i}_size`) as string);

    if (!imageSize.height || !imageSize.width) {
      failedFiles.push(file.name);
      continue;
    }

    /* update imageSizes */
    imageSizes[fileName] = {
      height: imageSize.height,
      width: imageSize.width,
    };

    /* get content-type */
    /* ref: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#common_image_file_types */
    let contentType = "";
    console.log(fileName.split(".")[fileName.split(".").length - 1].toLowerCase())
    switch (fileName.split(".")[fileName.split(".").length - 1].toLowerCase()) {
      case "apng":
        contentType = "image/apng";
        break;
      case "avif":
        contentType = "image/avif";
        break;
      case "gif":
        contentType = "image/gif";
        break;
      case "jpg":
      case "jpeg":
      case "jfif":
      case "pjpeg":
      case "pjp":
        contentType = "image/jpeg";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "svg":
      case "svgz":
        contentType = "image/svg+xml";
        break;
      case "webp":
        contentType = "image/webp";
        break;
      default:
        break;
    }

    /* upload image */
    const paramsForUploadImage = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Body: fileAsArrayBuffer,
      Key: `posts/${epoch}/${fileName}`,
      ContentType: contentType.length > 0 ? contentType : undefined,
    };

    const putObjectCommand = new PutObjectCommand(paramsForUploadImage);
    s3.send(putObjectCommand)
      .then((res) => NextResponse.json(res))
      .catch((errReason) => {
        console.error(errReason);
        NextResponse.json({ success: false, errReason });
      });
  }

  const paramsForUplaodImageSizes = {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Body: JSON.stringify(imageSizes),
    Key: `posts/${epoch}/imageSizes.json`,
  };
  s3.send(new PutObjectCommand(paramsForUplaodImageSizes));

  if (failedFiles.length > 0) {
    return NextResponse.json({ success: false, failedFiles }, { status: 500 });
  } else {
    return NextResponse.json({ success: true });
  }

  // const imageSize = (await new Promise((resolve, reject) => {
  //   gm(fileAsArrayBuffer).size((err, value) => {
  //     if (err) {
  //       return reject(err);
  //     }
  //     return resolve(value);
  //   });
  // })
  //   .then((res) => res)
  //   .catch((errReason) => {
  //     console.error("failed to get size of image!");
  //     console.error(errReason);
  //     return NextResponse.json({ success: false, errReason }, { status: 500 });
  //   })) as { height: number; width: number };
  // const image = await sharp(fileAsArrayBuffer);
  // const metadata = await image.metadata();
  // const imageSize = { height: metadata.height, width: metadata.width };

  // if (imageSize instanceof NextResponse) {
  //   return imageSize;
  // }
}
