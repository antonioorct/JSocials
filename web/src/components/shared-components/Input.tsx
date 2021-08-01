import { theme } from "../../theme/theme.config";
import { FC, InputHTMLAttributes } from "react";
import styled from "styled-components";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const InputField = styled.input<InputProps>`
  transition: all 0.3s;

  width: 100%;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;

  border: none;
  border-bottom: solid 0.1875rem
    ${(props) => props.error && theme.palette.danger};

  background: none;

  font-size: 1rem;

  &:focus {
    outline: none;
  }

  ${theme.mediaQueries.mobile} {
    padding: 0.25rem;
  }
`;

const Input: FC<InputProps> = ({
  placeholder,
  name,
  id,
  onChange,
  type,
  error,
  className,
}: InputProps) => {
  return (
    <InputField
      className={className}
      placeholder={placeholder}
      name={name}
      id={id}
      type={type}
      onChange={onChange}
      error={error}
    />
  );
};

export default Input;
