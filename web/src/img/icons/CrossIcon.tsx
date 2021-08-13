import { FC, HTMLAttributes } from "react";

const CrossIcon: FC<HTMLAttributes<HTMLOrSVGElement>> = ({ onClick }) => (
  <svg
    onClick={onClick}
    width="64"
    height="64"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill="#dddddd"
  >
    <path d="M32 0C14.328 0 0 14.327 0 32C0 49.674 14.328 64 32 64C49.673 64 64 49.674 64 32C64 14.327 49.673 0 32 0ZM32 62C15.432 62 2 48.568 2 32C2 15.432 15.432 2 32 2C48.568 2 62 15.432 62 32C62 48.568 48.568 62 32 62Z" />
    <path d="M16 16L48 48" stroke="#dddddd" strokeWidth="2" />
    <path d="M16 48L48 16" stroke="#dddddd" strokeWidth="2" />
  </svg>
);

export default CrossIcon;
