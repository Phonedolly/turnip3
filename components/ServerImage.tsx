import Image from "next/image";
import path from "path";

const ServerImage = (props: {
  src: string;
  alt: string;
  imageSizes: IImageSizes;
}) => {
  console.log(props.imageSizes);
  const specificImageSize =
    props.imageSizes[
      decodeURIComponent(path.parse(props.src).name) +
        decodeURIComponent(path.parse(props.src).ext)
    ];
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
