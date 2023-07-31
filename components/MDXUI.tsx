import { MDXComponents } from "mdx/types";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import pre from "./MDXComponents/pre";
import path from "path";

const componentsGenerator: (imageSize: IImageSizes) => MDXComponents = (
  imageSizes: IImageSizes,
) => ({
  h1: (props) => <h1 {...props} className="my-1 py-2 text-3xl font-bold" />,
  h2: (props) => <h2 {...props} className="my-1 py-2 text-2xl font-bold" />,
  h3: (props) => <h3 {...props} className="my-0.5 py-1.5 text-xl font-bold" />,
  h4: (props) => <h4 {...props} className="my-0 py-1 text-lg font-bold " />,
  img: (props) => {
    const specificImageSize =
      imageSizes[
        decodeURIComponent(path.parse(props.src as string).name) +
          decodeURIComponent(path.parse(props.src as string).ext)
      ];
    return (
      <Image
        src={props.src as string}
        alt={props.alt || ""}
        height={specificImageSize.height}
        width={specificImageSize.width}
      />
    );
  },
  pre: pre,
  span: (props) => {
    if (props.className?.includes("math math-inline")) {
      return (
        <span
          {...props}
          key={uuidv4()}
          className={`${props.className} select-none`}
        />
      );
    } else if (props.className === "katex-display") {
      return (
        <span
          {...props}
          key={uuidv4()}
          className={`${props.className} mx-0 my-2 overflow-hidden overflow-x-auto`}
        />
      );
    } else if (props.className === "katex") {
      return (
        <span {...props} className={`${props.className} whitespace-normal`} />
      );
    } else if (props.className === "base") {
      return <span {...props} className={`${props.className} mx-0 my-1`} />;
    } else {
      return <span {...props} />;
    }
  },
  div: (props) => {
    if (props.className?.includes("math math-display")) {
      return <div {...props} className={`${props.className} select-none`} />;
    } else {
      return <div {...props} />;
    }
  },
  a: (props) => <a {...props} />,
});

export default componentsGenerator;
