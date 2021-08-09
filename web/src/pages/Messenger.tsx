import { ChangeEvent, FC, useEffect, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import ReplyFormComponent from "../components/forms/ReplyForm";
import FriendList, { UserList } from "../components/FriendList";
import MessageList from "../components/MessageList";
import Modal from "../components/Modal";
import ContainerComponent from "../components/shared-components/Container";
import Input from "../components/shared-components/Input";
import { IChat, IMessage, IUser } from "../constants/models";
import { getUserId } from "../services/authServices";
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

const socket = io("http://localhost:3001");

const Messenger: FC = () => {
  const [reply, setReply] = useState("");
  const [chats, setChats] = useState<IChat[]>([]);
  const [currentChat, setCurrentChat] = useState<IChat | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      const chats = await getAllChats();

      setChats(chats);
    })();
  }, []);

  useEffect(() => {
    socket.emit("chat", getUserId()?.sub);
  }, [socket]);

  useEffect(() => {
    socket.off("message");

    socket.on("message", (message: IMessage) => newMessage(message));
  }, [chats]);

  const handleChangeReplyInput = (value: string) => setReply(value);

  const handleSubmitReply = async () => {
    if (reply === "" || currentChat === undefined) return;

    if (currentChat.id === -1) {
      console.log(currentChat.recepient);

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

  const getAllUsers = () =>
    chats.map((chat) => ({
      ...chat.recepient,
      message: { ...chat.messages[chat.messages.length - 1] },
    }));

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

  return (
    <>
      <Modal
        show={showModal}
        component={UserList}
        users={[
          ...getAllUsers(),
          {
            id: 4,
            firstName: "Cetvrti",
            lastName: "Peric",
            username: "d",
            email: "dntonio.orct@hotmail.com",
            image: "/logo512.png",
            password: "s",
            bio: "This is all about me",
            details: {
              gender: "Male",
              relationshipStatus: "Single",
              website: "www.website.com",
            },
          },
        ]}
        chats={chats}
        onClickCancel={handleClickCloseModal}
        onClickUser={handleClickNewChat}
      />

      <Container>
        <UsersContainer
          users={getAllUsers()}
          onClickUser={handleClickUser}
          onClickNew={handleClickOpenModal}
        />

        <ChatContainer>
          {currentChat !== undefined && (
            <>
              <MessageList chat={currentChat} onScrollTop={handleScrollToTop} />

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
