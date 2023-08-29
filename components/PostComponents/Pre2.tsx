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
  startLineNumber: number;
  children: React.JSX.Element | React.JSX.Element[];
}

export const SkipPre2 = () => {
  return (
    <Pre skip="1" showContainer={false}>
      <Code></Code>
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
          props.children[0].props.children.props.className?.replace(
            /language-/g,
            "",
          )
        }
        fileName={props.fileName || props.children[0].props.fileName}
      />
      <div className="flex w-full flex-col overflow-x-auto">
        {props.children.map((pre, i) => {
          let _notEnd = false;
          if (
            props.children instanceof Array &&
            i === props.children.length - 1 &&
            pre.props.notEnd
          ) {
            _notEnd = true;
          } else if (
            props.children instanceof Array &&
            props.children.length === 1 &&
            props.children[0].props.end
          ) {
            _notEnd = true;
          }
          const notEnd = _notEnd;

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
                  //   (m) => Number(m) - Number(pre.props.startLineNumber) + 1,
                  // );
                  return acc;
                },
                {},
              )
            : undefined;
          return (
            <Pre
              showContainer={false}
              showLineNumber={pre.props.showLineNumber || props.showLineNumber}
              highlights={highlights}
              skip={props.skip || pre.props.skip}
              startLineNumber={
                props.children instanceof Array && props.children.length === 1
                  ? props.startLineNumber || pre.props.startLineNumber
                  : pre.props.startLineNumber
              }
              notEnd={notEnd}
              key={uuidv4()}
            >
              <Code
                className={props.children[0].props.children.props.className}
              >
                {pre.props.children.props.children}
              </Code>
            </Pre>
          );
        })}
      </div>
    </Container>
  );
};
