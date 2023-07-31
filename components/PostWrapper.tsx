import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import componentsGenerator from "./MDXUI";

const PostWrapper = (props: { code: string; imageSizes: IImageSizes }) => {
  const Component = useMemo(() => getMDXComponent(props.code), [props.code]);
  return (
    <div className="flex flex-col gap-y-4 md:text-lg">
      <Component components={componentsGenerator(props.imageSizes)} />
    </div>
  );
};

export default PostWrapper;
