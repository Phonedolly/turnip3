import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import componentsGenerator from "./MDXUI";

const PostWrapper = (props: {
  code: string;
  imageSizes: IImageSizes;
  frontmatter: {
    [key: string]: any;
  };
}) => {
  const Component = useMemo(() => getMDXComponent(props.code), [props.code]);
  return (
    <div className="flex w-full flex-col gap-y-4 py-6 md:text-lg">
      <div className="flex w-full flex-col text-center gap-y-4">
        <h1 className="text-center font-outfit text-4xl font-bold">
          {props.frontmatter.title}
        </h1>
        <h2 className="font-outfit text-xl font-bold">
          {props.frontmatter.date}
        </h2>
      </div>
      <Component components={componentsGenerator(props.imageSizes)} />
    </div>
  );
};

export default PostWrapper;
