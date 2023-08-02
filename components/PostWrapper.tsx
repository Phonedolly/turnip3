import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import componentsGenerator from "./PostComponents";

const PostWrapper = (props: {
  code: string;
  imageSizes: IImageSizes;
  frontmatter: {
    [key: string]: any;
  };
}) => {
  const Component = useMemo(() => getMDXComponent(props.code), [props.code]);
  const date = new Date(
    props.frontmatter.updateTime[props.frontmatter.updateTime.length - 1] || "",
  );
  return (
    <div className="flex w-full flex-col gap-y-4 py-6 md:text-lg">
      <div className="flex w-full flex-col gap-y-4 text-center">
        <h1 className="text-center font-outfit text-4xl font-bold">
          {props.frontmatter?.title}
        </h1>
        <h2 className="font-outfit text-xl font-bold">
          {/* {`${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getD()}-${date.getHours()}-${date.getMinutes()}`} */}
          {`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}
        </h2>
      </div>
      <div className="flex w-full flex-col gap-y-2 sm:px-4">
        <Component components={componentsGenerator(props.imageSizes)} />
      </div>
    </div>
  );
};

export default PostWrapper;
