import { FC, useRef } from "react";
import styled from "styled-components";
import { IMessage } from "../constants/models";
import Message from "./Message";
import { theme } from "../theme/theme.config";

interface MessageListProps {
  messages: IMessage[];

  onScrollTop?(): void;
}

const Container = styled.div`
  flex-direction: column-reverse;
  gap: 1rem;

  display: flex;

  overflow-y: auto;

  height: 100%;
  box-sizing: border-box;
  padding: 0 0.5rem;
  margin: 1rem 0;

  color: ${theme.palette.white};
`;

const MessageList: FC<MessageListProps> = ({ messages, onScrollTop }) => {
  const messageContainer = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = messageContainer.current;
    if (!el) return;

    const isOnTop = el.offsetHeight - el.scrollHeight === el.scrollTop;

    isOnTop && onScrollTop && onScrollTop();
  };

  return (
    <Container onScroll={handleScroll} ref={messageContainer}>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </Container>
  );
};

export default MessageList;
