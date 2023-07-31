import { initS3 } from "@/lib/S3";
import getImagesSizes from "@/lib/getImageSizes";
import Image from "next/image";
import path from "path";
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";

const ServerImage = async (props: {
  src: string;
  alt: string;
  imageSizes: IImageSizes;
}) => {
  const specificImageSize = props.imageSizes[path.parse(props.src).name];
  return (
    <Image
      src={props.src as string}
      alt={props.alt || ""}
      height={specificImageSize.height}
      width={specificImageSize.width}
    />
  );
};

export default ServerImage;
