"use client";

import Image from "next/image";
import rangeParser from "parse-numeric-range";
import { Highlight, themes } from "prism-react-renderer";
import { v4 as uuidv4 } from "uuid";

type ColorReferences = {
  [key in "red" | "yellow" | "green" | "blue"]: string;
};

const calculateLinesToHighlight = (raw: ColorReferences) => {
  return (Object.keys(raw) as Array<keyof typeof raw>).reduce(
    (acc, currKey) => {
      const lineNumbers = rangeParser(raw[currKey]);

      const returnFunc = lineNumbers
        ? (index: number) => lineNumbers.includes(index + 1)
        : () => false;

      return {
        ...acc,
        [currKey]: returnFunc,
      };
    },
    {},
  ) as {
    [key in "red" | "yellow" | "green" | "blue"]: (index: number) => boolean;
  };

  // const lineNumbers = rangeParser(raw);
  // if (lineNumbers) {
  //   return (index: number) => lineNumbers.includes(index + 1);
  // } else {
  //   return () => false;
  // }
};

const pre = (props: any) => {
  const className = props.children?.props?.className || "";
  const code = props.children?.props.children?.trim() || "";
  const language = className.replace(/language-/, "");
  const fileName = props?.fileName || "";
  const showLineNumber = props?.showLineNumber || false;

  const rawHighlights = props.highlights && JSON.parse(props.highlights);
  // const highlights =
  //   props?.highlights && props.highlights.length > 0
  //     ? calculateLinesToHighlight(rawHighlights)
  //     : () => false;

  const highlights = rawHighlights && calculateLinesToHighlight(rawHighlights);

  let showLang = true;
  if (!language || language.length === 0 || language.includes(" ")) {
    showLang = false;
  }
  return (
    <div
      className="my-6 flex w-full flex-col rounded-xl bg-white shadow-[0_12px_32px_4px_rgba(0,0,0,0.26)]"
      key={uuidv4()}
    >
      {showLang === true ? (
        <div className="flex flex-row items-center py-3">
          <div
            className="text-md mx-3 rounded-lg bg-neutral-200/50 px-3 py-0.5 text-center font-outfit font-bold text-black shadow-[0_2px_8px_0.5px_rgba(0,0,0,0.26)]"
            key={uuidv4()}
          >{`${language}`}</div>
          <div
            className="mr-2 flex items-center justify-center break-all font-mono text-[0.95rem] text-neutral-400"
            key={uuidv4()}
          >
            {fileName && `${fileName}`}
          </div>
        </div>
      ) : null}
      <div className="overflow-auto" key={uuidv4()}>
        <Highlight
          // {...defaultProps}
          code={code}
          language={language}
          theme={themes.github}
          key={uuidv4()}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={className}
              style={{
                ...style,
                backgroundColor: "transparent",
                float: "left",
                minWidth: "100%",
              }}
            >
              {tokens.map((line, i) => (
                <div
                  {...getLineProps({ line, key: i })}
                  className={`block px-6 py-0.5 last:rounded-b-xl ${
                    highlights &&
                    highlights["red"] &&
                    highlights["red"](i) === true
                      ? `bg-red-100 hover:saturate-200 hover:bg-red-100/80`
                      : `hover:bg-neutral-200/70 hover:saturate-200`
                  } ${
                    highlights &&
                    highlights["yellow"] &&
                    highlights["yellow"](i) === true
                      ? `bg-yellow-100 hover:saturate-200 hover:bg-yellow-100/80`
                      : `hover:bg-neutral-200/70 hover:saturate-200`
                  } ${
                    highlights &&
                    highlights["green"] &&
                    highlights["green"](i) === true
                      ? `bg-green-100 hover:saturate-200 hover:bg-green-100/80`
                      : `hover:bg-neutral-200/70 hover:saturate-200`
                  } ${
                    highlights &&
                    highlights["blue"] &&
                    highlights["blue"](i) === true
                      ? `bg-blue-100 hover:saturate-200 hover:bg-blue-100/80`
                      : `hover:bg-neutral-200/70 hover:saturate-200`
                  }`}
                  key={uuidv4()}
                >
                  <div className="flex flex-row" key={uuidv4()}>
                    {showLineNumber === true ? (
                      <div className="flex flex-row">
                        <h1 className="mr-4 select-none text-neutral-400">
                          {`${i + 1}`}
                          {Array(
                            String(tokens.length).length - String(i + 1).length,
                          ).fill(<span>{` `}</span>)}
                        </h1>
                      </div>
                    ) : null}
                    <div
                      className="px-1 lg:whitespace-pre-wrap lg:break-all"
                      key={uuidv4()}
                    >
                      {line.map((token, key) => (
                        <span
                          {...getTokenProps({ token, key })}
                          key={uuidv4()}
                          className=" rounded-none font-mono text-[0.9rem]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};

export default pre;
