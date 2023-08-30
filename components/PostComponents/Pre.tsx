"use client";

import checkThisLineSelected from "@/lib/checkThisLineSelected";

import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type ColorReferences = {
  [key in string]: string;
};

const calculateHighlights = (raw: ColorReferences) => {
  return (Object.keys(raw) as Array<keyof typeof raw>).reduce(
    (acc, currKey) => {
      const returnFunc = checkThisLineSelected(raw[currKey]);

      return {
        ...acc,
        [currKey]: returnFunc,
      };
    },
    {},
  ) as {
    [key in string]: (index: number) => boolean;
  };
};
export const Container = (containerProps) => (
  <div
    className={`my-5 flex w-full flex-col rounded-2xl bg-white pb-3.5 pt-3.5 shadow-code dark:bg-neutral-700`}
    key={uuidv4()}
  >
    {containerProps.children}{" "}
  </div>
);

export const Info = (props) => (
  <div className={`flex flex-row items-center pb-3`}>
    {props.language !== undefined ? (
      <div
        className="text-md white mx-3 rounded-lg px-2 py-1 text-center font-outfit font-bold text-neutral-600 shadow-card dark:text-neutral-300"
        key={uuidv4()}
      >
        {props.language}
      </div>
    ) : null}
    {props.fileName !== undefined ? (
      <div
        className="mr-2 flex items-center justify-center break-all font-mono text-[0.95rem] text-neutral-400 first:ml-5"
        key={uuidv4()}
      >
        {props.fileName || null}
      </div>
    ) : null}
  </div>
);

const Pre = (props: any) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const className = props.children?.props?.className || "";
  let aheadOfCode = "";
  for (
    let i = 0;
    i <
    Math.max(props.startLineNumber ? Number(props.startLineNumber) - 1 : 0, 0);
    i++
  ) {
    aheadOfCode += "\n";
  }
  const endOfCode = props.notEnd ? "\n" : "";
  const code =
    aheadOfCode +
      props.children?.props.children?.slice(
        0,
        props.children?.props.children?.length - 1,
      ) +
      endOfCode || ""; // should cut last char, '\n'
  const numOfLineFeed = code.match(/\n/g)?.length || 0;
  const aheadOfSkip = `1-${Number(props.startLineNumber) - 1}`;
  const endOfSkip = `${props.notEnd ? `,${numOfLineFeed + 1}` : ``}`;
  const skipRange = `${aheadOfSkip}${
    props.skip !== undefined ? `,${props.skip}` : ``
  }${endOfSkip}`;
  const skip =
    props.skip !== undefined ||
    props.startLineNumber !== undefined ||
    props.notEnd !== undefined
      ? checkThisLineSelected(skipRange)
      : () => false;
  const language = className.replace(/language-/, "");
  const fileName = props?.fileName;
  const showLineNumber = props?.showLineNumber || false;
  const showContainer =
    props.showContainer === undefined || props.showContainer === true
      ? true
      : false;
  const rawHighlights =
    props.highlights && props.highlights instanceof Object
      ? props.highlights
      : props.highlights && JSON.parse(props.highlights);
  // const highlights =
  //   props?.highlights && props.highlights.length > 0
  //     ? calculateLinesToHighlight(rawHighlights)
  //     : () => false;

  const highlights = rawHighlights && calculateHighlights(rawHighlights);

  const showLang =
    !language || language.length === 0 || language.includes(" ") ? false : true;

  useEffect(() => {
    setIsDarkMode(
      window !== undefined &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
  }, []);

  const lines = (
    <div
      className={props.showContainer ? `overflow-x-auto` : `overflow-x-hidden`}
      key={uuidv4()}
    >
      <Highlight
        // {...defaultProps}
        code={code}
        language={language}
        theme={isDarkMode === true ? themes.palenight : themes.github}
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
            {tokens.map((line, i) => {
              /* Do you think there is a better approach? ☹️ */
              let style;
              if (highlights?.slate && highlights.slate(i) === true) {
                style = `bg-slate-100 hover:saturate-200 dark:bg-slate-700/50`;
              } else if (highlights?.gray && highlights.gray(i) === true) {
                style = `bg-gray-100 hover:saturate-200  dark:bg-gray-700/50`;
              } else if (highlights?.zinc && highlights.zinc(i) === true) {
                style = `bg-zinc-100 hover:saturate-200 dark:bg-zinc-700/50`;
              } else if (
                highlights?.neutral &&
                highlights.neutral(i) === true
              ) {
                style = `bg-neutral-100 hover:saturate-200 dark:bg-neutral-700/50`;
              } else if (highlights?.stone && highlights.stone(i) === true) {
                style = `bg-stone-100 hover:saturate-200 dark:bg-stone-700/50`;
              } else if (highlights?.red && highlights.red(i) === true) {
                style = `bg-red-100 hover:saturate-200 dark:bg-red-700/50`;
              } else if (
                highlights?.ogrange &&
                highlights.ogrange(i) === true
              ) {
                style = `bg-ogrange-100 hover:saturate-200 dark:bg-orange-700/50`;
              } else if (highlights?.amber && highlights.amber(i) === true) {
                style = `bg-amber-100 hover:saturate-200 dark:bg-amber-700/50`;
              } else if (highlights?.yellow && highlights.yellow(i) === true) {
                style = `bg-yellow-100 hover:saturate-200 dark:bg-yellow-700/50`;
              } else if (highlights?.lime && highlights.lime(i) === true) {
                style = `bg-lime-100 hover:saturate-200 dark:bg-lime-700/50`;
              } else if (highlights?.green && highlights.green(i) === true) {
                style = `bg-green-100 hover:saturate-200 dark:bg-green-700/50`;
              } else if (
                highlights?.emerald &&
                highlights.emerald(i) === true
              ) {
                style = `bg-emerald-100 hover:saturate-200 dark:bg-emerald-700/50`;
              } else if (highlights?.teal && highlights.teal(i) === true) {
                style = `bg-teal-100 hover:saturate-200 dark:bg-teal-700/50`;
              } else if (highlights?.cyan && highlights.cyan(i) === true) {
                style = `bg-cyan-100 hover:saturate-200 dark:bg-cyan-700/50`;
              } else if (highlights?.sky && highlights.sky(i) === true) {
                style = `bg-sky-100 hover:saturate-200 dark:bg-sky-700/50`;
              } else if (highlights?.blue && highlights.blue(i) === true) {
                style = `bg-blue-100 hover:saturate-200 dark:bg-blue-700/50`;
              } else if (highlights?.indigo && highlights.indigo(i) === true) {
                style = `bg-indigo-100 hover:saturate-200 dark:bg-indigo-700/50`;
              } else if (highlights?.violet && highlights.violet(i) === true) {
                style = `bg-violet-100 hover:saturate-200 dark:bg-violet-700/50`;
              } else if (highlights?.purple && highlights.purple(i) === true) {
                style = `bg-purple-100 hover:saturate-200 dark:bg-purple-700/50`;
              } else if (
                highlights?.fuchsia &&
                highlights.fuchsia(i) === true
              ) {
                style = `bg-fuchsia-100 hover:saturate-200 dark:bg-fuchsia-700/50`;
              } else if (highlights?.pink && highlights.pink(i) === true) {
                style = `bg-pink-100 hover:saturate-200 dark:bg-pink-700/50`;
              } else if (highlights?.rose && highlights.rose(i) === true) {
                style = `bg-rose-100 hover:saturate-200 dark:bg-rose-700/50`;
              } else {
                style = `hover:bg-neutral-200/50 hover:saturate-200 dark:hover:bg-neutral-600`;
              }

              const alsoSkipNextLine =
                i < tokens.length && skip(i + 1) === true;
              const skipThisLine = skip(i) === true;

              const thisLine = (
                <div
                  {...getLineProps({ line, key: i })}
                  className={`block px-6 ${style}`}
                  key={uuidv4()}
                >
                  <div className="flex flex-row" key={uuidv4()}>
                    {showLineNumber === true ? (
                      <div className="flex flex-row">
                        <h1
                          className="mr-4 select-none text-neutral-400"
                          key={uuidv4()}
                        >
                          {`${i + 1}`}
                          {Array(
                            String(tokens.length).length - String(i + 1).length,
                          ).fill(<span key={uuidv4()}>{` `}</span>)}
                        </h1>
                      </div>
                    ) : null}
                    <div className="px-1 md:whitespace-pre-wrap" key={uuidv4()}>
                      {line.map((token, key) => (
                        <span
                          {...getTokenProps({ token, key })}
                          key={uuidv4()}
                          className="h-3 rounded-none font-mono text-[0.9rem]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
              if (skipThisLine && alsoSkipNextLine) return null;
              else if (skipThisLine && !alsoSkipNextLine)
                return (
                  <div
                    {...getLineProps({ line, key: i })}
                    className={`block bg-neutral-100 px-6 hover:bg-neutral-200  dark:bg-neutral-600 dark:hover:bg-neutral-500/80`}
                    key={uuidv4()}
                  >
                    <div className="flex flex-row" key={uuidv4()}>
                      <div className="flex flex-row">
                        <h1 className="mr-4 select-none text-neutral-400">
                          {`···`}
                          {Array(String(tokens.length).length).fill(
                            <span key={uuidv4()}>{` `}</span>,
                          )}
                        </h1>
                      </div>
                      <div
                        className="px-1 md:whitespace-pre-wrap"
                        key={uuidv4()}
                      >
                        <span
                          key={uuidv4()}
                          className="rounded-none font-mono text-[0.9rem] italic"
                        ></span>
                      </div>
                    </div>
                  </div>
                );
              else return thisLine;
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
  if (showContainer === true)
    return (
      <Container>
        {showLang || fileName ? (
          <Info language={language} fileName={fileName} />
        ) : null}
        {lines}
      </Container>
    );
  else return lines;
};

export default Pre;
