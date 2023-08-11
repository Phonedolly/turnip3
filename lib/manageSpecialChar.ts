const needSpecialCare = [
  { regex: /\&/g, char: "&" },
  { regex: /\$/g, char: "$" },
  { regex: /[\x00-\x1f\x7f]/g, char: "_" },
  { regex: /\@/g, char: "@" },
  { regex: /\=/g, char: "=" },
  { regex: /\;/g, char: ";" },
  { regex: /\//g, char: "/" },
  { regex: /\:/g, char: ":" },
  { regex: /\+/g, char: "+" },
  { regex: /\ /g, char: " " },
  { regex: /\,/g, char: "," },
  { regex: /\?/g, char: "?" },
];
const mustAvoid = /\\|\{|[\x80-\xff]|\^|\}|\%|\`|\]|\"|\'|\>|\[|\~|\<|\#|\|/g;

export const specialCharToEscape = (title: string) => {
  
  const withMustAvoid = withSpecialCare.replaceAll(mustAvoid, "_");

const withSpecialCare = withMustAvoid.reduce((acc, curr) => {
    return acc.replaceAll(curr.regex, encodeURIComponent(curr.char));
  }, title);

  return withSpecialCare;
};

export const escapeToSpecialChar = (title: string) => {
  return decodeURIComponent(title);
};
