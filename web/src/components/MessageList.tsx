import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IMessage, IUser } from "../constants/models";
import Message from "./Message";
import { theme } from "../theme/theme.config";
import Author from "./Author";
import Badge from "./shared-components/Badge";

interface MessageListProps {
  messages: IMessage[];
  user: IUser;

  onScrollTop(): void;
}

const Container = styled.div`
  position: relative;
  flex-direction: column;
  gap: 0.4rem;

  display: flex;

  overflow: auto;

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

    font-size: 1.3rem;
  }

  ${theme.mediaQueries.mobile} {
    right: 1.5rem;
    bottom: 4rem;
  }
`;

const Header = styled.div`
  justify-content: center;

  display: flex;

  width: 95%;
  padding: 0.7rem 0;
  margin: 0 auto;
  border-radius: 0 0 0.5rem 0.5rem;

  background-color: ${theme.palette.white};
`;

const MessageList: FC<MessageListProps> = ({ user, messages, onScrollTop }) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageContainer = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messageContainer.current?.scrollTo({
      top: messageContainer.current?.scrollHeight,
    });

  useEffect(() => {
    // addEventListener is used because without it, the scrollToBottom
    // function is executed before all the children are rendered so the
    // element scrolls only part of the way
    window.addEventListener("load", scrollToBottom);
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleScroll = () => {
    const el = messageContainer.current;

    if (!el) return;
    const isOnBottom = el.scrollHeight - el.offsetHeight !== el.scrollTop;
    const isOnTop = el.scrollTop === 0;

    setShowScrollButton(isOnBottom);

    isOnTop && onScrollTop();
  };

  return (
    <>
      <Header>
        <Author user={user} />
      </Header>

      <Container onScroll={handleScroll} ref={messageContainer}>
        {messages.map((message) => {
          return (
            <Message
              key={message.id}
              alignment={message.user.id === 1 ? "left" : "right"}
              content={message.content}
            />
          );
        })}
      </Container>

      {showScrollButton && (
        <ScrollButton onClick={scrollToBottom} content="v" />
      )}
    </>
  );
};

export default MessageList;