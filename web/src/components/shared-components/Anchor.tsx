import { FC } from "react";
import styled, { css } from "styled-components";
import { theme } from "../../theme/theme.config";
import { Link, LinkProps } from "react-router-dom";

interface IAnchor extends LinkProps {
  underline?: boolean;
  label?: string;
  newTab?: boolean;
}

const StyledAnchor = styled(({ underline, ...props }: IAnchor) => (
  <Link {...props} />
))`
  position: relative;

  text-decoration: none;
  font-weight: ${theme.components.anchor.fontWeight};
  color: ${theme.components.anchor.color};

  &:hover {
    color: ${theme.components.anchor.hover};
  }

  ${(props) => props.underline && Underline}
`;

const Underline = css`
  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: -5px;
    width: 100%;
    height: 5px;
    transform: scaleX(0);
    transform-origin: left center;

    -webkit-transition: -webkit-transform 0.25s
        cubic-bezier(0.79, 0.01, 0.22, 0.99) 0s,
      -webkit-transform-origin 0s step-end 0.25s;
    transition: -webkit-transform 0.25s cubic-bezier(0.79, 0.01, 0.22, 0.99) 0s,
      -webkit-transform-origin 0s step-end 0.25s;
    transition: transform 0.25s cubic-bezier(0.79, 0.01, 0.22, 0.99) 0s,
      transform-origin 0s step-end 0.25s;
    transition: transform 0.25s cubic-bezier(0.79, 0.01, 0.22, 0.99) 0s,
      transform-origin 0s step-end 0.25s,
      -webkit-transform 0.25s cubic-bezier(0.79, 0.01, 0.22, 0.99) 0s,
      -webkit-transform-origin 0s step-end 0.25s;

    background-color: ${theme.components.anchor.color};
  }

  &:hover::after {
    transform: scaleX(100%);
  }
`;

const StylelessAnchor = styled(Link)`
  color: inherit;
  text-decoration: none;
  font-family: inherit;
`;

const Anchor: FC<IAnchor> = ({
  children,
  to,
  className,
  underline = false,
  label,
  newTab,
}: IAnchor) => (
  <>
    <StylelessAnchor
      to={to}
      target={newTab ? "_blank" : undefined}
      className={className}
    >
      {children}
    </StylelessAnchor>
    <StyledAnchor
      to={to}
      className={className}
      underline={underline}
      target={newTab ? "_blank" : undefined}
    >
      {label}
    </StyledAnchor>
  </>
);

export default Anchor;
