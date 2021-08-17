import { theme } from "../../theme/theme.config";
import { FC, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import styled, { css } from "styled-components";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  onChange(
    e:
      | InputHTMLAttributes<HTMLInputElement>
      | TextareaHTMLAttributes<HTMLTextAreaElement>
  ): void;
}

const Container = styled.div`
  flex-basis: 100%;
`;

const InputStyling = css<InputProps>`
  transition: all 0.3s;

  width: 100%;
  margin-bottom: 1.5rem;
  padding: 0;
  padding-bottom: 0.6rem;

  border: none;
  border-bottom: solid 3px ${(props) => props.error && theme.palette.danger};

  background: none;

  font-size: 1rem;

  &:focus {
    outline: none;
  }
`;

const InputField = styled.input<InputProps>`
  ${InputStyling}
`;

const TextAreaField = styled.textarea<InputProps>`
  ${InputStyling}
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
  value,
}: InputProps) => {
  return (
    <Container>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <InputField
        value={value}
        className={className}
        placeholder={placeholder}
        name={name}
        id={id}
        type={type}
        onChange={onChange}
        error={error}
      />
    </Container>
  );
};

export const TextArea: FC<InputProps> = ({
  placeholder,
  name,
  id,
  onChange,
  type,
  error,
  className,
  label,
  value,
}: InputProps) => {
  return (
    <Container>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <TextAreaField
        value={value}
        className={className}
        placeholder={placeholder}
        name={name}
        id={id}
        type={type}
        onChange={onChange}
        error={error}
      />
    </Container>
  );
};

export default Input;
