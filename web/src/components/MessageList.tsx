import { FC, useRef, useState } from "react";
import styled from "styled-components";
import { IMessage } from "../constants/models";
import Message from "./Message";
import { theme } from "../theme/theme.config";
import Badge from "./shared-components/Badge";

interface MessageListProps {
  messages: IMessage[];

  onScrollTop?(): void;
}

const Container = styled.div`
  position: relative;
  flex-direction: column-reverse;
  gap: 0.6rem;

  display: flex;

  overflow-y: auto;

  height: 100%;
  box-sizing: border-box;
  padding: 0 0.5rem 0.8rem;
  margin-top: 0.8rem;

  color: ${theme.palette.white};
`;

const ScrollButton = styled(Badge)`
  position: absolute;
  right: 7rem;
  bottom: 4.5rem;
  cursor: pointer;

  & > div {
    padding: 1rem;

    border: 1px solid ${theme.palette.lightBlack};

    background-color: ${theme.palette.darkGray};

    font-size: 1.3rem;
  }

  ${theme.mediaQueries.mobile} {
    right: 1.5rem;
    bottom: 4rem;
  }
`;

const MessageList: FC<MessageListProps> = ({ messages, onScrollTop }) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageContainer = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messageContainer.current?.scrollTo({
      top: messageContainer.current?.scrollHeight,
    });

  const handleScroll = () => {
    const el = messageContainer.current;

    if (!el) return;
    const isOnTop = el.offsetHeight - el.scrollHeight === el.scrollTop;
    const isOnBottom = el.scrollTop !== 0;

    setShowScrollButton(isOnBottom);

    isOnTop && onScrollTop && onScrollTop();
  };

  return (
    <>
      <Container onScroll={handleScroll} ref={messageContainer}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </Container>

      {showScrollButton && (
        <ScrollButton onClick={scrollToBottom} content="v" />
      )}
    </>
  );
};

export default MessageList;
