"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ErrorBoundary } from "react-error-boundary";
import PostWrapper from "../PostWrapper";

const Preview = (props: {
  code: string;
  frontmatter: {
    [key: string]: any;
  };
  previewScrollTop: number;
  setPreviewScrollTop: React.Dispatch<React.SetStateAction<number>>;
  imageSizes: IImageSizes;
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const MemoizedPostWrapper = useMemo(
    () => (
      <ErrorBoundary
        fallback={
          <h1 className="h-full w-full bg-red-500 m-2 rounded-2xl py-4 text-center font-outfit text-4xl font-bold text-white">
            MDX Has a Problem!
          </h1>
        }
      >
        <PostWrapper
          code={props.code}
          imageSizes={props.imageSizes}
          frontmatter={props.frontmatter}
        />
      </ErrorBoundary>
      // <PostWrapper
      //   code={props.code}
      //   imageSizes={props.imageSizes}
      //   frontmatter={props.frontmatter}
      // />
    ),
    [props.code, props.imageSizes, props.frontmatter],
  );

  useLayoutEffect(() => {
    previewRef.current?.scrollTo({ top: props.previewScrollTop });
  }, [MemoizedPostWrapper, props.previewScrollTop]);

  return (
    <div
      key={uuidv4()}
      onScroll={(e: any) => props.setPreviewScrollTop(e.target.scrollTop)}
      ref={previewRef}
    >
      {/* <Component components={componentsGenerator(props.imageSizes)} /> */}
      {MemoizedPostWrapper}
    </div>
  );
};

export default Preview;
