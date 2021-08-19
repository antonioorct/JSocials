import {
  ButtonHTMLAttributes,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { theme } from "../../theme/theme.config";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;

  color: "primary" | "secondary" | "link";
}

const ButtonContainer = styled.button<ButtonProps>`
  transition: background-color 0.15s ease-in-out;

  cursor: pointer;

  padding: ${(props) => (props.color === "link" ? "0" : "0.5rem 1rem;")};
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

interface StickyButtonProps extends ButtonProps {
  show: boolean;
}

const StickyButtonContainer = styled(Button)<{ scroll: boolean }>`
  align-self: center;
  position: sticky;
  top: 2rem;

  transition: top 0.4s ease;

  ${(props) => !props.scroll && "top: 7.1rem"};
`;

export const StickyButton: FC<StickyButtonProps> = ({
  label,
  onClick,
  color,
  className,
  show,
}: StickyButtonProps) => {
  const [scroll, setScroll] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    if (lastScrollY < window.scrollY && window.scrollY > 80) setScroll(true);
    else if (lastScrollY > window.scrollY) setScroll(false);

    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    setLastScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return show ? (
    <StickyButtonContainer
      label={label}
      color={color}
      onClick={onClick}
      className={className}
      scroll={scroll}
    >
      {label}
    </StickyButtonContainer>
  ) : null;
};

export default Button;
