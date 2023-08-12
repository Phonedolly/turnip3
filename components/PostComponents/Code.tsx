"use client";

import { useEffect, useState } from "react";

const Code = (props) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setIsDarkMode(
      window !== undefined &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
  }, []);

  return (
    // <code {...props} className="inline rounded-lg bg-neutral-200/60 p-1.5" />
    /* Use Inline style instead of tailwind, because it's not working well with the code block */
    <code
      {...props}
      style={{
        display: "inline",
        backgroundColor:
          isDarkMode === true
            ? `rgb(229 229 229 / 0.18)`
            : "rgb(229 229 229 / 0.6)",
        padding: "0.25rem 0.375rem",
        borderRadius: "0.5rem",
        wordBreak: "break-all",
        margin: "0rem 0.08rem",
      }}
    />
  );
};

export default Code;
