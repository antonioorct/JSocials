import React, { FC, HTMLAttributes } from "react";
import styled, { css } from "styled-components";
import { theme } from "../../theme/theme.config";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  disabled?: boolean;
}

const CardContainer = styled.div<CardProps>`
  position: relative;

  border-radius: 0.5rem;
  border: 1px solid
    ${(props) => (props.active ? theme.palette.darkGray : "transparent")};
  padding: 1rem;
  box-shadow: 1px 1px 10px #80808055;

  cursor: ${(props) => !props.disabled && "pointer"};

  transition: ease-in-out 0.1s;

  background-color: ${(props) =>
    props.active
      ? theme.palette.lightGray + " !important"
      : theme.palette.white};

  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}

  &:hover {
    border: 1px solid ${theme.palette.darkGray};
    background-color: ${theme.palette.darkWhite};
  }

  &:active {
    transform: translate(2px, 2px);
  }

  ${theme.mediaQueries.mobile} {
    flex: 0 0 45%;

    margin: 0 1rem;
  }
`;

const Card: FC<CardProps> = ({
  active,
  disabled,
  children,
  className,
  onClick,
}: CardProps) => {
  return (
    <CardContainer
      className={className}
      disabled={disabled}
      active={active}
      onClick={onClick}
    >
      {children}
    </CardContainer>
  );
};

export default Card;
