import Code from "./Code";
import Pre, { Container, Info } from "./Pre";
import React from "react";
import { v4 as uuidv4 } from "uuid";

interface IPre2Props {
  language?: string;
  fileName?: string;
  showLineNumber?: boolean;
  highlights?: any;
  skip?: string;
  children: React.JSX.Element | React.JSX.Element[];
}

export const SkipPre2 = () => {
  return (
    <Pre skip="1" showContainer={false}>
      <code></code>
    </Pre>
  );
};

export const Pre2 = (props: IPre2Props) => {
  if (!(props.children instanceof Array)) {
    const { children, ...otherProps } = props;
    return <Pre2 {...otherProps}>{[children]}</Pre2>;
  }
  return (
    <Container>
      <Info
        language={
          props.language ||
          props.children[0].props.children.props.className.replace(
            /language-/g,
            "",
          )
        }
        fileName={props.fileName || props.children[0].props.fileName}
      />
      {props.children.map((pre, i) => {
        const isEnd =
          (props.children instanceof Array &&
            i === props.children.length - 1 &&
            pre.props.end) ||
          (props.children instanceof Array && i < props.children.length - 1)
            ? true
            : false;
        const highlights = props.highlights
          ? Object.keys(props.highlights).reduce(
              (acc, curHighlightColorKey) => {
                acc[curHighlightColorKey] =
                  props.highlights[curHighlightColorKey];
                return acc;
              },
              {},
            )
          : pre.props.highlights
          ? Object.keys(JSON.parse(pre.props.highlights)).reduce(
              (acc, curHighlightColorkey) => {
                acc[curHighlightColorkey] = JSON.parse(pre.props.highlights)[
                  curHighlightColorkey
                ];
                // ].replaceAll(
                //   /[0-9]/g,
                //   (m) => Number(m) - Number(pre.props.startLine) + 1,
                // );
                return acc;
              },
              {},
            )
          : undefined;
        let aheadOfCode = "";
        for (let i = 0; i < Math.max(pre.props.startLine - 1, 0); i++) {
          aheadOfCode += "\n";
        }

        const skip =
          pre.props.startLine && pre.props.startLine > 1
            ? `1-${pre.props.startLine - 1}`
            : undefined;
        return (
          <div className="flex w-full flex-col" key={uuidv4()}>
            {/* {i === 0 && pre.props.startLine > 1 ? <SkipPre2 /> : null} */}
            <Pre
              showLineNumber={pre.props.showLineNumber || props.showLineNumber}
              highlights={highlights}
              showContainer={false}
              skip={skip}
            >
              <Code
                className={props.children[0].props.children.props.className}
              >
                {aheadOfCode + pre.props.children.props.children}
              </Code>
            </Pre>
            {isEnd === false ? <SkipPre2 /> : null}
          </div>
        );
      })}
    </Container>
  );
};
