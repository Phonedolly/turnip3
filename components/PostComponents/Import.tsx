const Import = (props: {
  width?: string;
  height?: string;
  children: React.JSX.Element;
}) => {
  let width;
  switch (props.width) {
    case "1/1":
      width = "w-full";
    case "1/2":
      width = "w-1/2";
      break;
    case "1/3":
      width = "w-1/3";
      break;
    case "1/4":
      width = "w-1/4";
      break;
    case "2/5":
      width = "w-2/5";
      break;
    case "3/5":
      width = "w-3/5";
      break;
    case "4/5":
      width = "w-4/5";
      break;
    default:
      width = "w-full";
  }
  return (
    <div
      className={`flex h-auto w-full flex-row ${width}`}
      style={{ height: props.height || `auto` }}
    >
      {props.children}
    </div>
  );
};

export default Import;
