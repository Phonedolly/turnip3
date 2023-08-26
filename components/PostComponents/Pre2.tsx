import checkThisLineSelected from "@/lib/checkThisLineSelected";
import Code from "./Code";
import Pre from "./Pre";
import React from "react";

interface IPre2Props {
  language?: string;
  fileName?: string;
  showLineNumber?: boolean;
  highlights?: any;
  skip?: boolean;
  children: React.JSX.Element | React.JSX.Element[];
}

interface ISubPre2Props {
  startLine?: number;
  endLine?: number;
  highlights?: any;
  skip?: boolean;
  children?: string;
}

export const SkipPre2 = () => {
  return <SubPre2 skip />;
};

export const Pre2 = (props: IPre2Props) => {
  console.log(props);
  if (!(props.children instanceof Array) && !props.children.props.children) {
    <Pre
      showLineNumber={props.showLineNumber}
      fileName={props.fileName}
      highlights={props.highlights}
      skip={props.skip}
    >
      <code className={`language-${props.language}`}>{props.children}</code>
    </Pre>;
  }
  const highlights =
    props.children instanceof Array
      ? props.children.reduce((acc, curr) => {
          if (curr.props.highlights !== undefined) {
            Object.keys(curr.props.highlights).map((currColorKey) => {
              acc[currColorKey] =
                acc[currColorKey] + "," + curr.props.highlights[currColorKey];
            });
          }
          return acc;
        }, {})
      : props.children.props.highlights;
  let skip =
    props.children instanceof Array
      ? props.children.reduce((acc, currChildren, i) => {
          /* skipStart and skipEnd considering if currChileren is <SkipPre2/> */
          const skipStart = i === 0 ? 0 : props.children[i - 1].endLine + 1;
          const skipEnd =
            props.children instanceof Array && i < props.children.length - 1
              ? props.children[i + 1].props.startLine - 1
              : Infinity;
          if (currChildren.props.skip === true) {
            /* skip just one line? */
            if (skipEnd - skipStart === 1) {
              acc = `${acc.length > 0 ? "," : ""}${String(skipEnd - 1)}`;
            } else {
              acc = `${acc.length > 0 ? "," : ""}${skipStart}-${skipEnd}`;
            }
          }

          return acc;
        }, "")
      : "";

  let skipCnt = 0;
  const codes =
    props.children instanceof Array
      ? props.children.reduce((acc, currChildren, i) => {
          if (currChildren.props.skip === true) {
            const curSkip = skip.split(",")[skipCnt];
            const checkThisLineIsToSkip = checkThisLineSelected(curSkip);
            for (
              let j = Number(curSkip);
              checkThisLineIsToSkip(j) === true;
              j++
            ) {
              acc.concat(<Code>{""}</Code>);
            }
          }
          return acc;
        }, [] as React.JSX.Element[])
      : props.children;

  return (
    <Pre
      className={`prism-code language-${props.language}`}
      showLineNumber={props.showLineNumber}
      fileName={props.fileName}
      highlights={highlights}
      skip={skip}
    >
      {codes}
    </Pre>
  );
};

export const SubPre2 = (props: ISubPre2Props) => {
  return (
    <Code
      startLine={props.startLine}
      endLine={props.endLine}
      highlights={props.highlights}
    >
      {props.children}
    </Code>
  );
};
