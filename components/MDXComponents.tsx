import { MDXComponents } from "mdx/types";
import rangeParser from "parse-numeric-range";
import { Highlight, themes } from "prism-react-renderer";
import { v4 as uuidv4 } from "uuid";

const calculateLinesToHighlight = (raw: string) => {
  const lineNumbers = rangeParser(raw);
  if (lineNumbers) {
    return (index: number) => lineNumbers.includes(index + 1);
  } else {
    return () => false;
  }
};

const components: MDXComponents = {
  h1: (props) => <h1 {...props} className="my-1 py-2 text-3xl font-bold" />,
  h2: (props) => <h2 {...props} className="my-1 py-2 text-2xl font-bold" />,
  h3: (props) => <h3 {...props} className="my-0.5 py-1.5 text-xl font-bold" />,
  h4: (props) => <h4 {...props} className="my-0 py-1 text-lg font-bold " />,
  pre: (props) => {
    const langClassName = props.children?.props?.className || "";
    const code = props.children?.props.children?.trim() || "";
    const language = langClassName.replace(/language-/, "");
    const fileName = props?.fileName || "";
    const showLineNumber = props?.showLineNumber || false;
    const highlights =
      props?.highlights && props.highlights.length > 0
        ? calculateLinesToHighlight(props.highlights)
        : () => false;
    return (
      <div className="my-8 flex flex-col gap-2 rounded-xl bg-neutral-100 shadow-[0_7px_24px_4px_rgba(0,0,0,0.25)]" key={uuidv4()}>
        <div className="flex flex-row items-center py-3">
          <div className="text-md mx-3 rounded-lg bg-neutral-200 px-3 py-0.5 text-center font-bold text-black shadow-[0_2px_4px_1px_rgba(0,0,0,0.1)]" key={uuidv4()}>{`${language}`}</div>
          <div className="mr-2 flex items-center justify-center break-all font-mono text-[0.95rem] text-neutral-400" key={uuidv4()}>
            {fileName && `${fileName}`}
          </div>
        </div>
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
                    className={`block px-6 last:rounded-b-xl ${highlights(i) === true
                      ? `bg-red-100 hover:saturate-200`
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
                              String(tokens.length).length -
                              String(i + 1).length,
                            ).fill(<span>{` `}</span>)}
                          </h1>
                        </div>
                      ) : null}
                      <div className="px-1 lg:whitespace-pre-wrap lg:break-all" key={uuidv4()}>
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
  },
  span: (props) => {
    if (props.className?.includes("math math-inline")) {
      return <span {...props} key={uuidv4()} className={`${props.className} select-none`} />;
    } else if (props.className === "katex-display") {
      return (
        <span
          {...props}
          key={uuidv4()}
          className={`${props.className} mx-0 my-2 overflow-hidden overflow-x-auto`}
        />
      );
    } else if (props.className === "katex") {
      return (
        <span {...props} className={`${props.className} whitespace-normal`} />
      );
    } else if (props.className === "base") {
      return <span {...props} className={`${props.className} mx-0 my-1`} />;
    } else {
      return <span {...props} />;
    }
  },
  div: (props) => {
    if (props.className?.includes("math math-display")) {
      return <div {...props} className={`${props.className} select-none`} key={uuidv4()} />;
    } else {
      return <div {...props} key={uuidv4()} />;
    }
  },
  a: (props) => <a {...props} key={uuidv4()} />,
};

export default components;
