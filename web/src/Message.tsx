import { FC, HTMLAttributes } from "react";
import styled from "styled-components";
import { theme } from "./theme/theme.config";

type Alignment = "left" | "right";

interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  alignment: Alignment;

  content: string;
}

const Container = styled.div<{ alignment: Alignment }>`
  padding: 1rem;
  background-color: ${(props) =>
    props.alignment === "left"
      ? theme.palette.darkGray
      : theme.palette.primary};
  width: 60%;

  align-self: ${(props) =>
    props.alignment === "left" ? "flex-start" : "flex-end"};

  border-radius: 0.5rem;
`;

const Message: FC<MessageProps> = ({ alignment, content }: MessageProps) => {
  return <Container alignment={alignment}>{content}</Container>;
};

export default Message;
