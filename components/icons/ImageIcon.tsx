function Icon(props: { className?: string; onClick: () => void }) {
  return (
    <svg
      className={`${props.className !== undefined ? props.className : ``}`}
      onClick={props.onClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <path
        fill="#000"
        fillRule="evenodd"
        d="M3 6a3 3 0 013-3h12a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm16 0v8.586l-3.293-3.293a1 1 0 00-1.414 0L13 12.586 9.207 8.793a1 1 0 00-1.414 0L5 11.586V6a1 1 0 011-1h12a1 1 0 011 1zM5 18v-3.586l3.5-3.5 3.793 3.793a1 1 0 001.414 0L15 13.414l4 4V18a1 1 0 01-1 1H6a1 1 0 01-1-1zm9.5-8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default Icon;
