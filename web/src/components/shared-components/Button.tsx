import { ButtonHTMLAttributes, FC } from "react";
import styled from "styled-components";
import { theme } from "../../theme/theme.config";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;

  color: "primary" | "secondary" | "link";
}

const ButtonContainer = styled.button<ButtonProps>`
  transition: background-color 0.15s ease-in-out;

  cursor: pointer;

  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${(props) =>
    theme.components.button[props.color].borderRadius};

  background-color: ${(props) =>
    theme.components.button[props.color].background};

  color: ${(props) => theme.components.button[props.color].color};
  font-weight: ${(props) => theme.components.button[props.color].fontWeight};
  font-size: ${theme.globalStyling.fontSize};

  &:hover {
    background-color: ${(props) =>
    theme.components.button[props.color].backgroundHover};

    color: ${(props) => theme.components.button[props.color].hover};
  }
`;

const Button: FC<ButtonProps> = ({
  label,
  onClick,
  color,
  className,
}: ButtonProps) => {
  return (
    <ButtonContainer
      label={label}
      color={color}
      onClick={onClick}
      className={className}
    >
      {label}
    </ButtonContainer>
  );
};

export default Button;
