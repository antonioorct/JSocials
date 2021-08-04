import { FC, HTMLAttributes, ReactNode } from "react";
import styled from "styled-components";
import { theme } from "../../theme/theme.config";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  content: string | ReactNode;
}

const Circle = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  margin-left: 0.4rem;
  padding: 0.4rem;

  background-color: ${theme.components.button.primary.background};

  color: ${theme.components.button.primary.color};
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 0;

  &::after {
    content: "";
    padding-bottom: 100%;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Badge: FC<BadgeProps> = ({
  children,
  content,
  className,
  onClick,
}: BadgeProps) => {
  return (
    <BadgeContainer className={className} onClick={onClick}>
      {children}
      <Circle>{content}</Circle>
    </BadgeContainer>
  );
};

export default Badge;
