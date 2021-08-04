import { FC, useState } from "react";
import styled from "styled-components";
import ReplyForm from "../components/forms/ReplyForm";
import FriendList from "../components/FriendList";
import MessageList from "../components/MessageList";
import ContainerComponent from "../components/shared-components/Container";
import { seedMessages, seedUsers } from "../constants/models";
import Message from "../Message";
import { theme } from "../theme/theme.config";

interface MessengerProps {}

const Container = styled(ContainerComponent)`
  margin-top: 70px;

  & > div {
    display: flex;
    height: calc(100vh - 70px);
  }
`;

const UsersContainer = styled.div`
  flex-basis: 30%;
  box-sizing: border-box;
  padding: 1rem;
  border-right: 1px solid ${theme.palette.darkGray};
`;

const ChatContainer = styled.div`
  flex-basis: 70%;
  flex-direction: column;

  display: flex;
  padding-bottom: 0.5rem;
  box-sizing: border-box;
`;

const Messenger: FC<MessengerProps> = (props: MessengerProps) => {
  const [reply, setReply] = useState("");

  const handleSubmitReply = () => {};
  const handleChangeReplyInput = (value: string) => setReply(value);

  return (
    <Container>
      <UsersContainer>
        <FriendList users={seedUsers} fullWidth />
      </UsersContainer>

      <ChatContainer>
        <MessageList messages={seedMessages} />
        <ReplyForm
          handleSubmit={handleSubmitReply}
          handleChangeInput={handleChangeReplyInput}
          state={reply}
        />
      </ChatContainer>
    </Container>
  );
};

export default Messenger;
