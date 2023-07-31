/* https://www.svgrepo.com/svg/510181/search */

function Icon(props: { className?: string; onClick: () => void }) {
  return (
    <svg
      className={`${props.className !== undefined ? props.className : ``}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#000"
        fillRule="evenodd"
        d="M10 5a5 5 0 100 10 5 5 0 000-10zm-7 5a7 7 0 1112.606 4.192l5.101 5.1a1 1 0 01-1.414 1.415l-5.1-5.1A7 7 0 013 10z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default Icon;
