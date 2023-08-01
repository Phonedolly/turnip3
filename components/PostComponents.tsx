import { MDXComponents } from "mdx/types";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import pre from "./MDXComponents/pre";
import path from "path";
import { isValidElement } from "react";

const componentsGenerator: (imageSize: IImageSizes) => MDXComponents = (
  imageSizes: IImageSizes,
) => ({
  h1: ({ children, ...otherProps }) => {
    return (
      <h1
        {...otherProps}
        className="mt-4 flex flex-row items-start gap-x-2 py-2 text-3xl font-bold"
        id={children?.toString()}
      >
        <a
          href={`#${children}`}
          className="top-14 text-3xl text-neutral-400 visited:text-neutral-400"
        >
          {/* 🔗 */}#
        </a>
        <p className="inline">{children}</p>
      </h1>
    );
  },
  h2: ({ children, ...otherProps }) => {
    return (
      <h2
        {...otherProps}
        className="mt-2 flex flex-row items-start gap-x-1.5 py-1 text-2xl font-bold"
        id={children?.toString()}
      >
        <a
          href={`#${children}`}
          className="top-14 text-3xl text-neutral-400 visited:text-neutral-400"
        >
          #
        </a>
        <p className="inline">{children}</p>
      </h2>
    );
  },
  h3: ({ children, ...otherProps }) => {
    return (
      <h3
        {...otherProps}
        className="mt-1 flex flex-row items-start gap-x-1 py-0.5 text-xl font-bold"
        id={children?.toString()}
      >
        <a
          href={`#${children}`}
          className="top-14 text-2xl text-neutral-400 visited:text-neutral-400"
        >
          #
        </a>
        <p className="inline">{children}</p>
      </h3>
    );
  },
  h4: ({ children, ...otherProps }) => {
    return (
      <h4
        {...otherProps}
        className="mt-0.5 flex flex-row items-start gap-x-0.5 py-[0.0625] text-lg font-bold"
        id={children?.toString()}
      >
        <a
          href={`#${children}`}
          className="top-14 text-xl text-neutral-400 visited:text-neutral-400"
        >
          #
        </a>
        <p className="inline">{children}</p>
      </h4>
    );
  },
  h5: (props) => (
    <h4 {...props} className="my-0 py-1 text-[1.075rem] font-bold " />
  ),
  h6: (props) => (
    <h4 {...props} className="my-0 py-1 text-[1.05rem] font-bold " />
  ),
  img: (props) => {
    const specificImageSize =
      imageSizes[
        decodeURIComponent(path.parse(props.src as string).name) +
          decodeURIComponent(path.parse(props.src as string).ext)
      ];
    if (!specificImageSize) return null;
    return (
      <Image
        className="my-6 rounded-2xl"
        src={props.src as string}
        alt={props.alt || ""}
        height={specificImageSize.height}
        width={specificImageSize.width}
      />
    );
  },
  pre: pre,
  code: (props) => {
    return (
      <code {...props} className="inline rounded-lg bg-neutral-200/60 p-1.5" />
    );
  },
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
  // TODO improve stability of list
  ol: (props) => {
    console.log(props);
    // if (props.children instanceof Array && props.children.length == 0) {
    //   return <ol {...props} />;
    // }
    if (props.children instanceof Array) {
      return (
        <div className="flex flex-col">
          {props.children?.map((child, i) => {
            if (i % 2 == 0) return null;
            return (
              <div
                className="flex flex-row items-center gap-x-1 text-base"
                key={uuidv4()}
              >
                <p className="inline select-none">{(i + 1) / 2}.</p>
                <li className="inline">{child}</li>
                {/* {child} */}
              </div>
            );
          })}
        </div>
      );
    } else {
      return props.children;
    }
  },
  ul: (props) => {
    if (props.children instanceof Array) {
      return (
        <div className="flex flex-col">
          {props.children?.map((child, i) => {
            // if (child instanceof Array) {
            //   // inner ul/ol element or '\n'
            //   return <ul key={uuidv4()}>{child}</ul>;
            // }
            if (i % 2 == 0) return null;
            return (
              <div
                className="flex flex-row items-center gap-x-1.5 text-base"
                key={uuidv4()}
              >
                <p className="select-none">•</p>
                {/* <li className="inline">{child}</li> */}
                {child}
              </div>
            );
          })}
        </div>
      );
    } else {
      return props.children;
    }
  },
  li: ({ children, ...otherProps }) => {
    console.log(otherProps.value);
    return (
      <div className="flex flex-col text-base leading-loose">{children}</div>
    );
  },
  p: (props) => (
    <p {...props} className="my-1 py-0.5 text-base leading-loose" />
  ),
  blockquote: ({ children, ...otherProps }) => {
    return (
      <div className="w-full rounded-xl break-all bg-white px-4 py-2 shadow-[0_12px_32px_4px_rgba(0,0,0,0.26)]">
        {children}
      </div>
    );
  },
});

export default componentsGenerator;
