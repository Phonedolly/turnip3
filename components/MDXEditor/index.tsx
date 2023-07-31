"use client";

import { Editor, useMonaco } from "@monaco-editor/react";
import monacoConfig from "@/components/MDXEditor/MonacoConfig";
import React, {
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import Turnip3Theme from "./Turnip3Theme";
import { MDXContentProps, getMDXComponent } from "mdx-bundler/client";
import { IPost } from "@/types/IPost";

const MDXEditor = (props: {
  setPost: Dispatch<SetStateAction<IPost>>;
  imageSizes: IImageSizes;
  epoch: number;
  setFrontmatter: Dispatch<
    SetStateAction<{
      [key: string]: any;
    }>
  >;
  initialCompiledMdxInfo: {
    mdx: string;
    code: string;
    frontmatter: {
      [key: string]: any;
    };
  };
}) => {
  const monaco = useMonaco();
  useEffect(() => {
    if (!monaco) {
      return;
    }
    monaco.editor.defineTheme("turnip3", Turnip3Theme);
    monaco.editor.setTheme("turnip3");
  }, [monaco]);

  useEffect(() => {
    props.setPost((prev) => ({
      ...prev,
      content: getMDXComponent(props.initialCompiledMdxInfo.code),
      mdx: props.initialCompiledMdxInfo.mdx,
    }));
  }, []);

  return (
    <Editor
      className="min-h-[45vh]"
      language="markdown"
      defaultValue={props.initialCompiledMdxInfo.mdx}
      loading={null}
      theme="turnip3"
      options={monacoConfig}
      onChange={async (mdx) => {
        try {
          const formData = new FormData();
          formData.append("mdxSource", mdx || "");
          const result = await (
            await fetch("/api/writer/buildMDX", {
              method: "POST",
              body: formData,
            })
          ).json();
          const { code, frontmatter } = result;
          console.log("MDX Compile success!");
          // const Component = () => getMDXComponent(code);
          props.setFrontmatter(frontmatter);
          props.setPost((prev) => ({
            ...prev,
            frontmatter,
            mdxHasProblem: false,
            code: code,
            mdx: mdx || "",
          }));
          console.log("Apply Success");
        } catch (e) {
          props.setPost((prev) => ({ ...prev, mdxHasProblem: true }));
          console.error(e);
          console.log("MDX compile error!");
        }
      }}
    />
  );
};

export default MDXEditor;
