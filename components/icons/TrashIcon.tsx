function Icon(props: { className?: string; onClick: () => void }) {
  return (
    <svg className={`${props.className !== undefined ? props.className : ``}`}
      onClick={props.onClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <path
        fill="#000"
        fillRule="evenodd"
        d="M9 5a2 2 0 012-2h2a2 2 0 012 2v1h4a1 1 0 110 2h-1v10a3 3 0 01-3 3H9a3 3 0 01-3-3V8H5a1 1 0 010-2h4V5zm1 3H8v10a1 1 0 001 1h6a1 1 0 001-1V8h-6zm3-2h-2V5h2v1zm-3 3a1 1 0 011 1v7a1 1 0 11-2 0v-7a1 1 0 011-1zm4 0a1 1 0 011 1v7a1 1 0 11-2 0v-7a1 1 0 011-1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default Icon;
