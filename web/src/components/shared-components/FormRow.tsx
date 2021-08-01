import { FC, HTMLAttributes } from "react";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  gap: 4rem;
`;

const Container: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
}: HTMLAttributes<HTMLDivElement>) => {
  return <Row>{children}</Row>;
};

export default Container;
