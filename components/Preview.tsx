"use client";

import { getMDXComponent } from "mdx-bundler/client";
import {
  createElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import componentsGenerator from "./MDXUI";

const Preview = (props: {
  code: string;
  previewScrollTop: number;
  setPreviewScrollTop: React.Dispatch<React.SetStateAction<number>>;
  imageSizes: IImageSizes;
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const Component = useMemo(() => getMDXComponent(props.code), [props.code]);

  useLayoutEffect(() => {
    previewRef.current?.scrollTo({ top: props.previewScrollTop });
  }, [Component, props.previewScrollTop]);

  return (
    <div
      className="h-[50vh] w-full overflow-y-scroll px-10 py-12"
      key={uuidv4()}
      onScroll={(e: any) => props.setPreviewScrollTop(e.target.scrollTop)}
      ref={previewRef}
    >
      <Component components={componentsGenerator(props.imageSizes)} />
    </div>
  );
};

export default Preview;
