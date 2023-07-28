/* https://www.svgrepo.com/svg/509905/dropdown-arrow */

function Icon(props: { className?: string; onClick: () => void }) {
  return (
    <svg
      className={`${props.className !== undefined ? props.className : ``}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      onClick={props.onClick}
    >
      <path
        fill="#000"
        fillRule="evenodd"
        d="M12.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L12 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default Icon;
