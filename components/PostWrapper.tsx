"use client";

import { getMDXComponent } from "mdx-bundler/client";
import { useEffect, useLayoutEffect, useMemo } from "react";
import componentsGenerator from "./PostComponents";
import { ErrorBoundary } from "react-error-boundary";
import * as reactThreeFiber from "@react-three/fiber";
import * as reactThreeDrei from "@react-three/drei";
import * as THREE from "three"

const PostWrapper = (props: {
  code: string;
  imageSizes: IImageSize;
  frontmatter: IFrontmatter;
  safeCode?: string;
  setSafeCode?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const globalVars = {
    reactThreeFiber,
    reactThreeDrei,
    THREE,
  };

  const Component = useMemo(
    () => getMDXComponent(props.code, globalVars),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.code],
  );
  // const Component = getMDXComponent(props.code);

  useLayoutEffect(() => {
    props.setSafeCode && props.setSafeCode(props.code);
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
          const ComponentForError = getMDXComponent(
            props.safeCode || "",
            globalVars,
          );
          return (
            <div className="relative h-full w-full">
              <h1 className="absolute flex h-full w-full items-center justify-center bg-red-500/10 py-4 font-outfit text-2xl font-bold text-white">
                MDX has a Problem.
              </h1>
              <WithBoundary
                view={
                  <ComponentForError
                    components={componentsGenerator(props.imageSizes)}
                  />
                }
              />
            </div>
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
