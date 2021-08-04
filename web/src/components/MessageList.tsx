import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IMessage } from "../constants/models";
import Message from "../Message";
import Button from "./shared-components/Button";

interface MessageListProps {
  messages: IMessage[];
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0 0.5rem;
  box-sizing: border-box;

  overflow: auto;
`;

const ScrollButton = styled(Button)`
  position: absolute;
  right: 5rem;
  bottom: 3.5rem;
`;

const MessageList: FC<MessageListProps> = ({ messages }) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("scrollTop: " + messageContainer.current?.scrollTop);
    console.log("scrollHeight: " + messageContainer.current?.scrollHeight);
    console.log("clientHeight: " + messageContainer.current?.clientHeight);
    if (messageContainer.current)
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
  }, [messages]);

  const handleClickScrollButton = () => {
    if (messageContainer.current)
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
  };

  const handleScroll = () => {
    console.log("scrollTop: " + messageContainer.current?.scrollTop);
    console.log("scrollHeight: " + messageContainer.current?.scrollHeight);
    console.log("clientHeight: " + messageContainer.current?.clientHeight);

    if (messageContainer.current) setShowScrollButton(true);
  };

  return (
    <>
      <Container ref={messageContainer} onScroll={handleScroll}>
        {messages.map((message) => (
          <Message
            key={message.id}
            alignment={message.user.id === 1 ? "left" : "right"}
            content={message.content}
          />
        ))}
      </Container>

      {showScrollButton ? (
        <ScrollButton
          onClick={handleClickScrollButton}
          label="Scroll"
          color="primary"
        />
      ) : (
        <div />
      )}
    </>
  );
};

export default MessageList;
