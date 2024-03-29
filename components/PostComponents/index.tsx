import { MDXComponents } from "mdx/types";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import Pre from "./Pre";
import path from "path";
import React from "react";
import Code from "./Code";
import { Pre2 } from "./Pre2";
import Import from "./Import";
import Three from "./Three";

const componentsGenerator: (imageSize: IImageSize) => MDXComponents = (
  imageSizes: IImageSize,
) => ({
  h1: ({ children, ...otherProps }) => {
    return (
      <h1
        {...otherProps}
        className="mt-4 flex flex-row items-start gap-x-2 py-2 text-3xl font-bold dark:text-neutral-200"
        id={typeof children === "string" ? children?.toString() : ``}
      >
        <a
          href={`#${typeof children === "string" ? children?.toString() : ``}`}
          className="top-14 text-3xl text-neutral-400 visited:text-neutral-400 hover:text-neutral-500 hover:underline hover:decoration-neutral-500"
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
        className="mt-2 flex flex-row items-start gap-x-1.5 py-1 text-2xl font-bold dark:text-neutral-200"
        id={typeof children === "string" ? children?.toString() : ``}
      >
        <a
          href={`#${typeof children === "string" ? children?.toString() : ``}`}
          className="top-14 text-2xl text-neutral-400 visited:text-neutral-400 hover:text-neutral-500 hover:underline hover:decoration-neutral-500"
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
        className="mt-1 flex flex-row items-start gap-x-1 py-0.5 text-xl font-bold dark:text-neutral-200"
        id={typeof children === "string" ? children?.toString() : ``}
      >
        <a
          href={`#${typeof children === "string" ? children?.toString() : ``}`}
          className="top-14 text-xl text-neutral-400 visited:text-neutral-400 hover:text-neutral-500 hover:underline hover:decoration-neutral-500"
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
        className="mt-0.5 flex flex-row items-start gap-x-0.5 py-[0.0625] text-lg font-bold dark:text-neutral-200"
        id={typeof children === "string" ? children?.toString() : ``}
      >
        <a
          href={`#${typeof children === "string" ? children?.toString() : ``}`}
          className="top-14 text-lg text-neutral-400 visited:text-neutral-400 hover:text-neutral-500  hover:underline hover:decoration-neutral-500"
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
      <div className="flex h-auto w-full flex-row justify-center">
        <Image
          className="my-5"
          src={props.src as string}
          alt={props.alt || ""}
          height={specificImageSize.height}
          width={specificImageSize.width}
        />
      </div>
    );
  },
  pre: Pre,
  code: Code,
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
  a: ({ children, href, ...otherProps }) => {
    return (
      <a
        href={href}
        {...otherProps}
        className="break-all font-bold underline underline-offset-4 hover:text-neutral-500 hover:decoration-neutral-500"
      >
        {children}
      </a>
    );
  },
  // TODO improve stability of list
  ol: ({ children, otherProps }: any) => {
    // if (props.children instanceof Array && props.children.length == 0) {
    //   return <ol {...props} />;
    // }
    return (
      <ol className="flex flex-col">
        {/* TODO improve stability of list */}
        {children instanceof Array &&
          children?.map((child: any, i: number) => {
            if (i % 2 == 0 || !child) return null;
            return (
              <div
                className="flex flex-row items-center gap-x-1 text-base leading-loose md:leading-10"
                key={uuidv4()}
              >
                <span className="w-3" />
                <p className="select-none">{(i + 1) / 2}.</p>
                <div key={uuidv4()} id={child.props.id}>
                  {child.props.children}
                </div>
              </div>
            );
          })}
      </ol>
    );
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
                {/* <p className="select-none">•</p> */}
                {/* <li className="inline">{child}</li> */}
                <div className="flex flex-row items-center">
                  <span className="w-3" />
                  {child}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return <div>{props.children}</div>;
    }
  },
  li: ({ children, ...otherProps }) => {
    // if (!(children instanceof Array)) {
    //   return (
    //     <div className="flex flex-row items-center gap-x-1.5">
    //       <p className="inline select-none"></p>
    //       {children}
    //     </div>
    //   );
    // }
    return (
      // <div className="flex flex-row text-base leading-loose">
      <div
        className="flex flex-col items-start text-base leading-loose md:leading-10"
        id={otherProps.id}
      >
        <div className="inline">
          <p className="mr-1.5 inline select-none items-center">•</p>
          {children}
        </div>
      </div>
    );
  },
  p: ({ children, ...otherProps }) => {
    if (typeof children === "string") {
      return (
        <p className="my-1 py-0.5 text-base leading-loose  dark:text-neutral-300 md:text-lg md:leading-9 xl:text-xl xl:leading-10">
          {children}
        </p>
      );
    }
    return (
      <div
        {...otherProps}
        className="my-1 py-0.5 text-base leading-loose dark:text-neutral-300 md:text-lg md:leading-9 xl:text-xl xl:leading-10"
      >
        {children}
      </div>
    );
  },

  blockquote: ({ children, ...otherProps }) => {
    return (
      <div className="mx-2 my-5 rounded-2xl bg-white px-4 py-2 shadow-[0_12px_32px_4px_rgba(0,0,0,0.26)]">
        {children}
      </div>
    );
  },
  hr: () => (
    <div className="my-4 flex h-1 w-full flex-row justify-center rounded-md bg-neutral-300" />
  ),
  Image2: (props) => {
    const specificImageSize =
      imageSizes[
        decodeURIComponent(path.parse(props.src as string).name) +
          decodeURIComponent(path.parse(props.src as string).ext)
      ];
    if (!specificImageSize) return null;
    let width;
    switch (props.width) {
      case "1/1":
        width = "w-full";
      case "1/2":
        width = "w-1/2";
        break;
      case "1/3":
        width = "w-1/3";
        break;
      case "1/4":
        width = "w-1/4";
        break;
      case "2/5":
        width = "w-2/5";
        break;
      case "3/5":
        width = "w-3/5";
        break;
      case "4/5":
        width = "w-4/5";
        break;
      default:
        width = "w-full";
    }
    return (
      <div
        className={`|
          my-5 flex h-auto w-full flex-col items-center justify-center`}
        {...props}
      >
        <Image
          className={`h-auto ${width}`}
          src={props.src as string}
          alt={props.alt || ""}
          height={specificImageSize.height}
          width={specificImageSize.width}
        />
        {props.caption !== undefined && typeof props.caption === "string" ? (
          <p className="my-2 w-full break-all px-6 text-center text-sm text-neutral-700 md:text-base">
            {props.caption}
          </p>
        ) : null}
      </div>
    );
  },
  table: ({ children, ...otherProps }) => {
    return (
      <div className="my-5 flex w-full flex-row justify-center">
        <div className="flex w-fit flex-row items-center justify-center overflow-x-auto rounded-2xl bg-white px-4 py-2 shadow-card">
          <table className="" {...otherProps}>
            {children}
          </table>
        </div>
      </div>
    );
  },
  th: ({ children, ...otherProps }) => {
    return (
      <th
        {...otherProps}
        className="group/th flex w-full flex-col justify-between p-0 "
      >
        <div className="flex h-full w-full flex-row items-center justify-center px-4 py-2 text-center font-outfit text-xl">
          {children}
        </div>
        <div className="h-[0.18rem] w-full bg-neutral-500 group-first/th:rounded-tl-md group-last/th:rounded-tr-md" />
      </th>
    );
  },
  tr: ({ children, ...otherProps }) => {
    return (
      <tr className="group/tr flex w-full flex-row border-none" {...otherProps}>
        {children}
      </tr>
    );
  },
  td: ({ children, ...otherProps }: any) => {
    return (
      <td
        {...otherProps}
        className={`group/td flex w-full flex-col justify-between p-0 ${
          !otherProps.align ? `text-center` : ``
        }`}
      >
        <div className=" h-0.5 w-full bg-neutral-200 group-first/tr:h-[0.18rem] group-first/td:rounded-bl-md group-first/tr:group-first/td:rounded-bl-md group-first/tr:bg-neutral-500 group-last/td:rounded-br-md group-first/tr:group-last/td:rounded-br-md" />
        <div className="px-4 py-2 text-base">{children}</div>
        <div className="h-0.5 w-full bg-neutral-200 group-first/td:rounded-tl-md group-last/tr:hidden group-last/td:rounded-tr-md" />
      </td>
    );
  },
  Quote2: (props) => {
    return (
      <div className="my-5 flex w-full flex-col rounded-2xl bg-white p-4 shadow-card dark:bg-neutral-700">
        <div className="flex select-none flex-row justify-start">
          <p>
            <span
              className={`${
                props.quoteSerif
                  ? `font-noto-serif text-7xl`
                  : `relative left-0.5 top-1.5 text-8xl`
              } ${
                props.quoteItalic ? `italic` : ``
              } font-bold text-neutral-400`}
            >
              “
            </span>
          </p>
        </div>
        <div
          className={`${
            props.serif ? `-mt-8` : `-mt-10`
          }  ml-4 flex w-full flex-col gap-y-1 pr-8`}
        >
          <div className="flex w-full flex-row">
            <div
              className={`my-1 break-all py-0.5 text-base leading-relaxed text-neutral-700 dark:text-neutral-300 md:text-lg md:leading-7 xl:text-xl xl:leading-loose ${
                props.contextItalic ? `italic` : ``
              } ${props.contextSerif ? `font-noto-serif` : ``}`}
            >
              {props.quote}
            </div>
          </div>
          {props.author ? (
            <div className="flex w-full flex-row">
              <p
                className={`${props.authorSerif ? `font-noto-serif` : ``} ${
                  props.authorItalic ? `italic` : ``
                } break-all text-base text-neutral-500 md:text-lg xl:text-xl`}
              >
                &mdash; {props.author}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  },
  Import: Import,
  // Three: Three,
  Pre2: Pre2,
});

export default componentsGenerator;
