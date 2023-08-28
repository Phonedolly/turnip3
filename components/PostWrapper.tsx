"use client";

import { getMDXComponent } from "mdx-bundler/client";
import { useEffect, useMemo } from "react";
import componentsGenerator from "./PostComponents";
import { ErrorBoundary } from "react-error-boundary";

const PostWrapper = (props: {
  code: string;
  imageSizes: IImageSize;
  frontmatter: IFrontmatter;
  safeCode: string;
  setSafeCode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const Component = useMemo(() => getMDXComponent(props.code), [props.code]);
  useEffect(() => {
    console.log(`safe Render!`);
    props.setSafeCode(props.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const WithBoundary = ({
    view: ComponentsForInternal,
  }: {
    view: React.JSX.Element;
  }) => {
    return (
      <ErrorBoundary
        FallbackComponent={() => {
          const ComponentForError = getMDXComponent(props.safeCode);
          return (
            <WithBoundary
              view={
                <ComponentForError
                  components={componentsGenerator(props.imageSizes)}
                />
              }
            />
          );
        }}
      >
        {ComponentsForInternal}
      </ErrorBoundary>
    );
  };

  const firstPublished =
    (props.frontmatter.updateTime &&
      new Date(props.frontmatter.updateTime[0])) ||
    null;

  const lastEdited =
    (props.frontmatter.updateTime &&
      props.frontmatter.updateTime.length > 1 &&
      new Date(
        props.frontmatter.updateTime[props.frontmatter.updateTime.length - 1],
      )) ||
    null;

  return (
    <div className="flex w-full flex-col gap-y-4 py-6 md:text-lg">
      <div className="flex w-full flex-col gap-y-4 text-center lg:gap-y-8 xl:gap-y-12">
        <h1 className="text-center font-outfit text-4xl font-bold dark:text-neutral-200 lg:text-5xl xl:text-6xl">
          {props.frontmatter?.title}
        </h1>
        <div className="items-cetner flex flex-col gap-y-4">
          <div className="flex flex-col items-center gap-y-1">
            {firstPublished && (
              <div className="flex flex-row gap-x-1.5 text-sm text-neutral-600 dark:text-neutral-300 sm:text-lg">
                <h2 className="font-outfit">First Published at</h2>
                <h2 className="font-outfit font-bold">
                  {`${firstPublished.toLocaleDateString()} ${firstPublished.toLocaleTimeString()}`}
                </h2>
              </div>
            )}
            {lastEdited ? (
              <div className="flex flex-row gap-x-1.5 text-sm text-neutral-700 sm:text-lg">
                <h2 className="font-outfit">Last Edited at</h2>
                <h2 className="font-outfit font-bold">
                  {`${lastEdited.toLocaleDateString()} ${lastEdited.toLocaleTimeString()}`}
                </h2>
              </div>
            ) : null}
          </div>
          <p className="text-sm text-neutral-800 sm:text-lg">
            {props.frontmatter.description}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col gap-y-2 sm:px-4">
        <WithBoundary
          view={
            <Component components={componentsGenerator(props.imageSizes)} />
          }
        />
      </div>
    </div>
  );
};

export default PostWrapper;
