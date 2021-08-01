import { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import { theme } from "../../theme/theme.config";

const Wrapper = styled.div`
  width: min(100rem, 90%);
  margin: auto;

  ${theme.mediaQueries.mobile} {
    width: 85%;
  }
`;

const OuterContainer = styled.div`
  width: 100%;
`;

const Container: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <OuterContainer {...props}>
      <Wrapper>{children}</Wrapper>
    </OuterContainer>
  );
};

export default Container;
