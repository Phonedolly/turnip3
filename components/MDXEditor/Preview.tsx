"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
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
      <PostWrapper
        code={props.code}
        imageSizes={props.imageSizes}
        frontmatter={props.frontmatter}
      />
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
