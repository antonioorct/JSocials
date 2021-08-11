import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import Author from "../components/Author";
import ReplyFormComponent from "../components/forms/ReplyForm";
import { UserList } from "../components/FriendList";
import MessageList from "../components/MessageList";
import Modal from "../components/Modal";
import ContainerComponent from "../components/shared-components/Container";
import { SOCKET_URL } from "../constants/apiRoutes";
import { IChat, IMessage, IUser, IUserMessage } from "../constants/models";
import { getUserId } from "../services/authServices";
import { getAllFriends } from "../services/friendServices";
import {
  addMessage,
  createChat,
  getAllChats,
  sendMessage,
} from "../services/messagingServices";
import { theme } from "../theme/theme.config";

const Container = styled(ContainerComponent)`
  margin-top: 70px;

  & > div {
    display: flex;

    height: calc(100vh - 70px);

    ${theme.mediaQueries.mobile} {
      flex-direction: column;

      height: calc(${window.innerHeight}px - 70px);

      width: 100%;
    }
  }
`;

const UsersContainer = styled(UserList)`
  flex-basis: 30%;

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

const UserListModal = styled(UserList)`
  padding: 3rem 4rem;
  border-radius: 0.8rem;

  background-color: ${theme.palette.white};
`;

const AuthorHeader = styled.div`
  justify-content: center;

  display: flex;

  width: 95%;
  padding: 0.7rem 0;
  margin: 0 auto;
  border-radius: 0 0 0.5rem 0.5rem;

  background-color: ${theme.palette.white};
`;

const socket = io(SOCKET_URL);

const Messenger: FC = () => {
  const [reply, setReply] = useState("");
  const [chats, setChats] = useState<IChat[]>([]);
  const [currentChat, setCurrentChat] = useState<IChat | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [friends, setFriends] = useState<IUserMessage[]>([]);

  const { state } = useLocation<{ user: IUser }>();

  useEffect(() => {
    socket.emit("chat", getUserId()?.sub);

    (async () => {
      const chats = await getAllChats();

      setChats(chats);

      if (state !== undefined) openChat(chats, state.user);
    })();
  }, []);

  useEffect(() => {
    socket.off("message");

    socket.on("message", (message: IMessage) => newMessage(message));
    (async () => {
      let friends = await getAllFriends();
      const existingChats = getAllChatUsers();

      friends = friends.filter((friend) => {
        const friendExists = existingChats.some(
          (chat: IUserMessage) => chat.id === friend.id
        );

        return !friendExists;
      });

      const users = [...friends, ...existingChats];
      users.sort((first, second) =>
        `${first.firstName} ${first.lastName}`.localeCompare(
          `${second.firstName} ${second.lastName}`
        )
      );

      setFriends(users);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chats]);

  const handleChangeReplyInput = (value: string) => setReply(value);

  const handleSubmitReply = async () => {
    if (reply === "" || currentChat === undefined) return;

    if (currentChat.id === -1) {
      const newChat = await createChat(reply, currentChat.recepient);

      setChats([newChat, ...chats]);
      setCurrentChat(newChat);
    } else {
      const message = await sendMessage(currentChat.id, reply);

      newMessage(message);
    }

    setReply("");
  };

  const newMessage = (message: IMessage) => {
    const newChats = addMessage(chats, message);

    setChats(newChats);
  };

  const handleScrollToTop = () => console.log("Scrolled to top");

  const getChatWithUser = (user: IUser) =>
    chats.find((chat) => chat.recepient.id === user.id);

  const handleClickUser = (user: IUser) => {
    const chat = getChatWithUser(user);

    setCurrentChat(chat);
  };

  const handleClickOpenModal = () => setShowModal(true);
  const handleClickCloseModal = () => setShowModal(false);

  const handleClickNewChat = (user: IUser) => {
    handleClickCloseModal();

    openChat(chats, user);
  };

  const openChat = (chats: IChat[], user: IUser) => {
    const existingChat = chats.find((chat) => chat.recepient.id === user.id);

    if (existingChat) setCurrentChat(existingChat);
    else
      setCurrentChat({
        id: -1,
        messages: [],
        users: [user],
        recepient: user,
      });
  };

  const getAllChatUsers = (): IUserMessage[] =>
    chats.map((chat) => ({
      ...chat.recepient,
      message: chat.messages[chat.messages.length - 1],
    }));

  return (
    <>
      <Modal
        show={showModal}
        component={UserListModal}
        users={friends}
        chats={chats}
        onClickCancel={handleClickCloseModal}
        onClickUser={handleClickNewChat}
      />

      <Container>
        <UsersContainer
          users={getAllChatUsers()}
          onClickUser={handleClickUser}
          onClickNew={handleClickOpenModal}
        />

        <ChatContainer>
          {currentChat && (
            <>
              <AuthorHeader>
                <Author user={currentChat.recepient} />
              </AuthorHeader>

              <MessageList
                messages={currentChat.messages}
                onScrollTop={handleScrollToTop}
              />

              <ReplyForm
                handleSubmit={handleSubmitReply}
                handleChangeInput={handleChangeReplyInput}
                state={reply}
              />
            </>
          )}
        </ChatContainer>
      </Container>
    </>
  );
};

export default Messenger;
