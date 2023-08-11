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
  const withSpecialCare = needSpecialCare.reduce((acc, curr) => {
    return acc.replaceAll(curr.regex, encodeURIComponent(curr.char));
  }, title);
  const withMustAvoid = withSpecialCare.replaceAll(mustAvoid, "_");

  return withMustAvoid;
};

export const escapeToSpecialChar = (title: string) => {
  return decodeURIComponent(title);
};
