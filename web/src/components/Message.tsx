import { FC } from "react";
import styled from "styled-components";
import { IMessage } from "../constants/models";
import { isUserOwnerOfObject } from "../services/authServices";
import { theme } from "../theme/theme.config";
import DateLabelComponent from "./DateLabel";

type Alignment = "left" | "right";

interface MessageProps {
  message: IMessage;
}

const Container = styled.div<{ alignment: Alignment }>`
  flex-direction: column;
  align-self: ${(props) =>
    props.alignment === "left" ? "flex-start" : "flex-end"};

  display: flex;
  max-width: 60%;
`;

const MessageContainer = styled.div<{ alignment: Alignment }>`
  align-self: ${(props) =>
    props.alignment === "left" ? "flex-start" : "flex-end"};

  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;

  background-color: ${(props) =>
    props.alignment === "left"
      ? theme.palette.darkGray
      : theme.palette.primary};

  word-break: break-all;
`;

const DateLabel = styled(DateLabelComponent)<{ alignment: Alignment }>`
  text-align: ${(props) => props.alignment};
`;

const Message: FC<MessageProps> = ({ message }: MessageProps) => {
  const getMessageAlignment = () =>
    isUserOwnerOfObject(message.user) ? "right" : "left";

  return (
    <Container alignment={getMessageAlignment()}>
      <MessageContainer alignment={getMessageAlignment()}>
        {message.content}
      </MessageContainer>
      <DateLabel date={message.createdAt} alignment={getMessageAlignment()} />
    </Container>
  );
};

export default Message;
