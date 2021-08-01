import { theme } from "../../theme/theme.config";
import { FC, InputHTMLAttributes } from "react";
import styled from "styled-components";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const InputField = styled.input<InputProps>`
  transition: all 0.3s;

  width: 100%;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;

  border: none;
  border-bottom: solid 3px ${(props) => props.error && theme.palette.danger};

  background: none;

  font-size: 1rem;

  &:focus {
    outline: none;
  }

  ${theme.mediaQueries.mobile} {
    padding: 0.25rem;
  }
`;

const InputLabel = styled.label`
  display: block;
  opacity: 0.75;

  margin-bottom: 0.5rem;
  margin-left: 0.1rem;

  white-space: nowrap;

  font-weight: bold;
  font-size: 0.9rem;
`;

const Input: FC<InputProps> = ({
  placeholder,
  name,
  id,
  onChange,
  type,
  error,
  className,
  label,
}: InputProps) => {
  return (
    <>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <InputField
        className={className}
        placeholder={placeholder}
        name={name}
        id={id}
        type={type}
        onChange={onChange}
        error={error}
      />
    </>
  );
};

export default Input;
