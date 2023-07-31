"use client";

import { Editor, useMonaco } from "@monaco-editor/react";
import monacoConfig from "@/components/MDXEditor/MonacoConfig";
import {
  compileMdx,
  compileMdxSync,
  compileMdxSyncCompiledOnly,
} from "@/lib/mdx";
import { Dispatch, SetStateAction, memo, useEffect, useState } from "react";
import Turnip3Theme from "./Turnip3Theme";
import MDXComponents from "@/components/MDXComponents";

const initialMdx = `---
title: Trying out new custom code blocks
date: "2021-11-02"
description: "A great way to display your code snippets on your MDX+Gatsby blog."
---

Here's an example of my new custom code blocks:

\`\`\`jsx
// here's a button in React!
<button
  onClick={() => {
    alert("Hello MDX!");
  }}
>
  test
</button>
\`\`\`

Wow! Such code snippets!
Let's see another, with line highlighting:

\`\`\`js
// fizzbuzz in JS
for (let i = 1; i <= 100; i++) {
  let out = "";
  if (i % 3 === 0) out += "Fizz";
  if (i % 5 === 0) out += "Buzz";
  console.log(out || i);
}
\`\`\`
`;

const MDXEditor = (props: {
  setPost: Dispatch<SetStateAction<IPost>>;
  imageSizes: IImageSizes;
}) => {
  const initialCompiledMdx = compileMdxSync(initialMdx);
  const [Content, setContent] = useState<JSX.Element>(
    initialCompiledMdx.content,
  );

  const monaco = useMonaco();
  useEffect(() => {
    if (!monaco) {
      return;
    }
    monaco.editor.defineTheme("turnip3", Turnip3Theme);
    monaco.editor.setTheme("turnip3");
  }, [monaco]);

  useEffect(() => {
    props.setPost((prev) => ({ ...prev, content: initialCompiledMdx.content }));
  }, []);

  return (
    <Editor
      language="markdown"
      defaultValue={initialMdx}
      loading={null}
      theme="turnip3"
      options={monacoConfig}
      onChange={(mdx) => {
        try {
          const res = compileMdxSyncCompiledOnly(mdx || "");
          console.log("MDX Compile success!");
          const content = res.compiledMdx({
            components: MDXComponents(props.imageSizes),
          });
          setContent(content);
          props.setPost((prev) => ({
            ...prev,
            frontmatter: res.frontmatter,
            mdxHasProblem: false,
            content,
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
