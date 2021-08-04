import { ChangeEvent, FC, useState } from "react";
import styled from "styled-components";
import ReplyFormComponent from "../components/forms/ReplyForm";
import FriendList from "../components/FriendList";
import MessageList from "../components/MessageList";
import ContainerComponent from "../components/shared-components/Container";
import Input from "../components/shared-components/Input";
import { IUser, seedMessages, seedUsers } from "../constants/models";
import { theme } from "../theme/theme.config";

const Container = styled(ContainerComponent)`
  margin-top: 70px;

  & > div {
    display: flex;

    height: calc(${window.innerHeight}px - 70px);

    ${theme.mediaQueries.mobile} {
      flex-direction: column;

      width: 100%;
    }
  }
`;

const UsersContainer = styled.div`
  flex-basis: 30%;
  flex-direction: column;
  justify-content: flex-start;

  display: flex;

  box-sizing: border-box;
  padding: 1rem 1rem 0;
  border-right: 1px solid ${theme.palette.darkGray};

  & > * {
    flex-basis: auto;
  }

  ${theme.mediaQueries.mobile} {
    flex-basis: unset;

    padding: 0;
    margin-bottom: 1rem;
  }
`;

const UserQueryInput = styled(Input)`
  ${theme.mediaQueries.mobile} {
    display: block;

    width: 90%;
    margin: 0 auto 1rem;
  }
`;

const UserList = styled(FriendList)`
  overflow: auto;
  padding-bottom: 1rem;

  ${theme.mediaQueries.mobile} {
    flex-direction: row;
    flex-wrap: nowrap;

    padding: 0 1rem 1rem;

    & > * {
      flex: 0 0 45% !important;
    }
  }
`;

const ChatContainer = styled.div`
  flex-basis: 70%;
  flex-direction: column;

  display: flex;

  padding-bottom: 0.5rem;
  box-sizing: border-box;

  ${theme.mediaQueries.mobile} {
    flex-basis: unset;

    overflow: hidden;
  }
`;

const ReplyForm = styled(ReplyFormComponent)`
  padding: 0 0.5rem;
  box-sizing: border-box;
`;

const Messenger: FC = () => {
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState(seedMessages);
  const [users] = useState(seedUsers);
  const [filterUserQuery, setFilterUserQuery] = useState("");

  const handleSubmitReply = () => {
    if (reply === "") return;

    setMessages([
      ...messages,
      {
        id: messages[messages.length - 1].id + 1,
        content: reply,
        user: seedUsers[1],
      },
    ]);

    setReply("");
  };
  const handleChangeReplyInput = (value: string) => setReply(value);

  const handleClickUser = (user: IUser) => {
    console.log("New user! " + user.firstName);
  };

  const handleScrollToTop = () => {
    console.log("Scrolled to top");
  };

  const handleFilterQueryChange = ({
    currentTarget: { value },
  }: ChangeEvent<HTMLInputElement>) => setFilterUserQuery(value);

  const getFilteredUsers = (): IUser[] =>
    users.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(filterUserQuery.toLowerCase())
    );

  return (
    <Container>
      <UsersContainer>
        <UserQueryInput
          value={filterUserQuery}
          onChange={handleFilterQueryChange}
          placeholder="Search users..."
        />
        <UserList
          users={getFilteredUsers()}
          onClickUser={handleClickUser}
          fullWidth
        />
      </UsersContainer>

      <ChatContainer>
        <MessageList
          user={seedUsers[0]}
          messages={messages}
          onScrollTop={handleScrollToTop}
        />

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
