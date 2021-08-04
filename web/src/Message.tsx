import { FC } from "react";
import styled from "styled-components";
import { theme } from "./theme/theme.config";

type Alignment = "left" | "right";

interface MessageProps {
  alignment: Alignment;

  content: string;
}

const Container = styled.div<{ alignment: Alignment }>`
  align-self: ${(props) =>
    props.alignment === "left" ? "flex-start" : "flex-end"};

  padding: 1rem;
  width: 60%;
  border-radius: 0.5rem;

  background-color: ${(props) =>
    props.alignment === "left"
      ? theme.palette.darkGray
      : theme.palette.primary};
`;

const Message: FC<MessageProps> = ({ alignment, content }: MessageProps) => {
  return <Container alignment={alignment}>{content}</Container>;
};

export default Message;
