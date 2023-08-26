import rangeParser from "parse-numeric-range";

const checkThisLineSelected = (range: string) => {
  const lineNumbers = rangeParser(range);

  const returnFunc = lineNumbers
    ? (index: number) => lineNumbers.includes(index + 1)
    : () => false;

  return returnFunc;
};

export default checkThisLineSelected;
