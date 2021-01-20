import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contexts/UserContext";
import http from "../services/httpService";
import socketIo from "socket.io-client";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { getFriends } from "../services/friendsService";
import { createNewChat } from "../services/chatService";

import "../style.css";
import { useParams } from "react-router-dom";

export default function Messenger(props) {
  const user = useContext(UserContext)[0];

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const messageContainer = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [socket, setSocket] = useState(null);
  let sendTypingTimeout = useRef(0);
  let typingTimeout = useRef(0);

  const [messageForm, setMessageForm] = useState("");
  const [searchForm, setSearchForm] = useState("");

  const [showNewChats, setShowNewChats] = useState(false);
  const [friends, setFriends] = useState([]);

  const messageFormRef = useRef(null);

  useEffect(async () => {
    setSocket(socketIo("http://localhost:3001"));
    await fetchAndSetChats();
    if (props.location.state)
      newOrExistingChat(props.location.state.newChatUser);
  }, []);

  useEffect(async () => {
    if (!socket) return;
    let chatIds = [];
    chats.forEach((chat) => chatIds.push(chat.chatId));

    socket.emit("Subscribe", chatIds);
    socket.off("TYPING_SENT");
    socket.on("TYPING_SENT", (data) => {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = 0;

      if (!typingTimeout.current) {
        const tempChats = [...chats];
        tempChats[
          chats.findIndex((chat) => chat.chatId === data.chatId)
        ].isTyping = true;
        setChats(tempChats);

        typingTimeout.current = setTimeout(() => {
          typingTimeout.current = 0;
          const tempChats = [...chats];
          tempChats[
            chats.findIndex((chat) => chat.chatId === data.chatId)
          ].isTyping = false;
          setChats(tempChats);
        }, 3000);
      }
    });
    socket.off("MESSAGE_SENT");
    socket.on("MESSAGE_SENT", (data) => {
      addMessageToChat(data, data.chatId);
    });
  }, [chats]);

  const fetchAndSetChats = async () => {
    const { data } = await http.get(
      "http://localhost:3001/api/chats/" + user.id
    );

    const newChats = [];
    data.forEach((chat) => {
      newChats.push({
        chatId: chat.chat.id,
        totalCount: 1,
        name: chat.chat.name || chat.user.firstName + " " + chat.user.lastName,
        user: chat.user,
        messages: [chat.message],
        isLoaded: false,
      });
    });
    setChats((prevChats) => [...prevChats, ...newChats]);
  };

  const addMessageToChat = async (newMessage, chatId) => {
    currentChat.messages.push(newMessage);
    currentChat.totalCount++;
    currentChat.isTyping = false;
    clearTimeout(typingTimeout.current);
    typingTimeout.current = 0;

    const tempChats = chats.filter(
      (chat) => chat.chatId && chat.chatId !== chatId
    );
    setChats([currentChat, ...tempChats]);

    if (currentChat.chatId === newMessage.chatId)
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
  };

  const fetchAndSetMessages = async (
    paging = false,
    createdAt = new Date(Date.now()).toISOString()
  ) => {
    setShowNewChats(false);
    if (!currentChat) return;
    if (!paging) {
      if (currentChat.hasOwnProperty("scrollPos"))
        messageContainer.current.scrollTop = currentChat.scrollPos;
      else
        messageContainer.current.scrollTop =
          messageContainer.current.scrollHeight;
      if (currentChat.isLoaded) return;
    }

    const { data, headers } = await http.get(
      "http://localhost:3001/api/messages/" +
        currentChat.chatId +
        "?createdAt=" +
        createdAt +
        "&userId=" +
        user.id
    );

    const tempScroll = messageContainer.current.scrollHeight;
    const newChats = [...chats];
    if (!paging) {
      currentChat.messages = [];
      currentChat.totalCount = parseInt(headers.count);
      currentChat.isLoaded = true;
    }

    currentChat.messages = [...data, ...currentChat.messages];

    setChats(newChats);

    if (!paging)
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    else
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight - tempScroll;
  };

  const newOrExistingChat = async (user) => {
    const chatIndex = chats.findIndex((chat) => chat.user.id === user.id);

    if (chatIndex === -1) {
      const newChat = {
        totalCount: 0,
        friend: user,
        name: user.firstName + " " + user.lastName,
        messages: [],
        isLoaded: false,
      };

      setChats((prevChats) => [newChat, ...prevChats]);
      setCurrentChat(newChat);
    } else setCurrentChat(chats[chatIndex]);

    setShowNewChats(false);
  };

  useEffect(() => {
    if (currentChat && currentChat.hasOwnProperty("chatId"))
      fetchAndSetMessages();
  }, [currentChat]);

  const handleScroll = () => {
    setShowScrollButton(
      messageContainer.current.scrollTop -
        messageContainer.current.scrollHeight +
        messageContainer.current.clientHeight
    );
  };

  const handleChange = (e) => {
    setMessageForm(e.target.value);

    if (!sendTypingTimeout.current) {
      socket.emit("TYPING", {
        chatId: currentChat,
        username: user.email,
        message: "Typing...",
      });

      sendTypingTimeout.current = setTimeout(() => {
        sendTypingTimeout.current = 0;
      }, 2500);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    setMessageForm("");

    clearTimeout(sendTypingTimeout.current);
    sendTypingTimeout.current = 0;

    const { data: newMessage } = await http.post(
      "http://localhost:3001/api/messages",
      {
        senderId: user.id,
        body: messageForm,
        chatId: currentChat.chatId,
        createdAt: new Date().getTime(),
      }
    );

    addMessageToChat(newMessage, newMessage.chatId);
    socket.emit("MESSAGE", newMessage);
  };

  return (
    <div className="row m-0">
      <div
        className="col-2 pb-2 overflow-auto"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <Button
          style={{ width: "100%" }}
          variant="success"
          onClick={async () => {
            const data = await getFriends(user);
            setFriends(data);

            setShowNewChats(true);
          }}
        >
          New chat
        </Button>

        <Form>
          <FormControl
            value={searchForm}
            onChange={({ target }) => {
              setSearchForm(target.value);
            }}
            placeholder="Search chat..."
          ></FormControl>
        </Form>

        {chats
          .filter((chat) =>
            chat.name.toLowerCase().includes(searchForm.toLowerCase())
          )
          .map((chat, index) => (
            <div
              style={{ cursor: "pointer" }}
              className="border border-dark rounded my-1"
              key={index}
              onClick={() => {
                setShowNewChats(false);

                if (currentChat && !showNewChats)
                  currentChat.scrollPos = messageContainer.current.scrollTop;

                setCurrentChat(chat);

                if (messageFormRef.current) messageFormRef.current.focus();
              }}
            >
              <h5>{chat.name}</h5>
              {chat.isTyping ? (
                <p style={{ fontWeight: "bold", color: "#2e851d" }}>
                  Typing...
                </p>
              ) : (
                chat.messages[chat.messages.length - 1] && (
                  <div>
                    <p style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                      {chat.messages[chat.messages.length - 1].body}
                    </p>
                    <p>
                      {chat.messages[chat.messages.length - 1].createdAt
                        .substring(0, 19)
                        .replace("T", " ")}
                    </p>
                  </div>
                )
              )}
            </div>
          ))}
      </div>

      <div className="col-10">
        {!showNewChats ? (
          currentChat && (
            <div>
              <div
                ref={messageContainer}
                className="overflow-auto pb-2 text-center"
                style={{ height: "calc(100vh - 104px)" }}
                onScroll={() => {
                  handleScroll();
                }}
              >
                <div
                  className="sticky-top border border-dark rounded"
                  style={{ marginTop: "-3px", backgroundColor: "white" }}
                >
                  <h4 style={{ paddingTop: "3px" }}>{currentChat.name}</h4>
                </div>

                {currentChat.messages.length < currentChat.totalCount && (
                  <Button
                    onClick={() => {
                      fetchAndSetMessages(
                        true,
                        currentChat.messages[0].createdAt
                      );
                    }}
                  >
                    Load more
                  </Button>
                )}

                {currentChat.messages.map((message, index) => (
                  <div className="clearfix" key={index}>
                    <div
                      className={
                        "float-" +
                        (message.senderId == user.id ? "right" : "left")
                      }
                    >
                      <p
                        className={"border border-dark rounded p-2 text-left"}
                        style={{ maxWidth: "600px", wordBreak: "break-all" }}
                      >
                        {message.body}
                        <br />
                        <div
                          className="text-right"
                          style={{ fontSize: "12px" }}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {showScrollButton ? (
                <Button
                  onClick={() =>
                    (messageContainer.current.scrollTop =
                      messageContainer.current.scrollHeight)
                  }
                  style={{
                    position: "absolute",
                    right: "50px",
                    bottom: "60px",
                  }}
                >
                  Scroll
                </Button>
              ) : (
                <div />
              )}

              <Form onSubmit={sendMessage}>
                <FormControl
                  value={messageForm}
                  onChange={handleChange}
                  placeholder="Enter message..."
                  autoFocus
                  ref={messageFormRef}
                ></FormControl>
              </Form>
            </div>
          )
        ) : (
          <div>
            {friends.map((friend, index) => (
              <div
                className="border border-dark rounded p-2 my-2 d-flex align-items-center"
                key={index}
              >
                <h5 className="ml-2 mb-0">
                  {friend.user.firstName} {friend.user.lastName}
                </h5>
                <Button
                  className="ml-2"
                  onClick={() => newOrExistingChat(friend.user)}
                >
                  +
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
