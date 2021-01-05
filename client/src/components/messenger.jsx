import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../contexts/UserContext";
import http from "../services/httpService";
import socketIo from "socket.io-client";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

export default function Messenger() {
  const user = useContext(UserContext)[0];

  const [chats, setChats] = useState(null);
  const [hashTable, setHashTable] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);

  const messageContainer = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [socket, setSocket] = useState(null);
  let sendTypingTimeout = useRef(0);
  let typingTimeout = useRef(0);

  const [messageForm, setMessageForm] = useState("");

  useEffect(() => {
    setSocket(socketIo("http://localhost:3001"));
    fetchAndSetChats();
  }, []);

  useEffect(async () => {
    if (!chats) return;
    const tempHashTable = [];
    chats.forEach((chat, currIndex) => {
      tempHashTable[chat.chatId] = currIndex;
    });

    setHashTable(tempHashTable);
  }, [chats]);

  useEffect(() => {
    if (!socket) return;
    let chatIds = [];
    chats.forEach((chat) => chatIds.push(chat.chatId));

    socket.emit("Subscribe", chatIds);
    socket.off("TYPING_SENT");
    socket.on("TYPING_SENT", (data) => {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = 0;

      if (!typingTimeout.current) {
        const newChats = [...chats];
        newChats[hashTable[data.chatId]].isTyping = true;
        setChats(newChats);

        typingTimeout.current = setTimeout(() => {
          typingTimeout.current = 0;
          const newChats = [...chats];
          newChats[hashTable[data.chatId]].isTyping = false;
          setChats(newChats);
        }, 3000);
      }
    });
    socket.off("MESSAGE_SENT");
    socket.on("MESSAGE_SENT", (data) => {
      addMessageToChat(data, data.chatId);
    });
  }, [hashTable]);

  const fetchAndSetChats = async () => {
    const { data } = await http.get(
      "http://localhost:3001/api/chats/" + user.id
    );

    const newChats = [];
    data.forEach((convo) => {
      newChats.push({
        chatId: convo.chat.id,
        totalCount: 1,
        name: convo.chat.name,
        messages: [convo.message],
        isLoaded: false,
      });
    });
    setChats(newChats);
  };

  const addMessageToChat = async (newMessage, chatId) => {
    const oldChats = [...chats];
    oldChats[hashTable[chatId]].messages = [
      ...oldChats[hashTable[chatId]].messages,
      newMessage,
    ];
    oldChats[hashTable[chatId]].totalCount++;
    oldChats[hashTable[chatId]].isTyping = false;
    clearTimeout(typingTimeout.current);
    typingTimeout.current = 0;

    const newChats = oldChats.filter((chat) => chat.chatId !== chatId);
    setChats([{ ...oldChats[hashTable[chatId]] }, ...newChats]);

    if (currentChatId === newMessage.chatId)
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
  };

  const fetchAndSetMessages = async (
    paging = false,
    createdAt = new Date(Date.now()).toISOString()
  ) => {
    if (!currentChatId) return;
    if (!paging) {
      if (chats[hashTable[currentChatId]].hasOwnProperty("scrollPos"))
        messageContainer.current.scrollTop =
          chats[hashTable[currentChatId]].scrollPos;
      else
        messageContainer.current.scrollTop =
          messageContainer.current.scrollHeight;
      if (chats[hashTable[currentChatId]].isLoaded) return;
    }

    const { data, headers } = await http.get(
      "http://localhost:3001/api/messages/" + currentChatId,
      {
        headers: { createdAt },
      }
    );

    const tempScroll = messageContainer.current.scrollHeight;
    const newChats = [...chats];
    if (!paging) {
      newChats[hashTable[currentChatId]].messages = [];
      newChats[hashTable[currentChatId]].totalCount = parseInt(headers.count);
      newChats[hashTable[currentChatId]].isLoaded = true;
    }

    newChats[hashTable[currentChatId]].messages = [
      ...data,
      ...newChats[hashTable[currentChatId]].messages,
    ];

    setChats(newChats);

    if (!paging)
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    else
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight - tempScroll;
  };

  useEffect(() => {
    fetchAndSetMessages();
  }, [currentChatId]);

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
        chatId: currentChatId,
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
        chatId: currentChatId,
        createdAt: new Date().getTime(),
      }
    );

    addMessageToChat(newMessage, newMessage.chatId);
    socket.emit("MESSAGE", newMessage);
  };

  const getChatById = (arr, id) => {
    return arr.find((chat) => chat.chatId === id);
  };

  return (
    <div className="row m-0">
      <div className="col-2">
        {chats &&
          chats.map((chat) => {
            return (
              <div
                style={{ cursor: "pointer" }}
                className="border border-dark"
                key={chat.chatId}
                onClick={() => {
                  if (currentChatId)
                    chats[hashTable[currentChatId]].scrollPos =
                      messageContainer.current.scrollTop;
                  setCurrentChatId(chat.chatId);
                }}
              >
                <h5>{chat.name}</h5>
                {chat.isTyping ? (
                  <p style={{ fontWeight: "bold", color: "#2e851d" }}>
                    Typing...
                  </p>
                ) : (
                  <div>
                    <p>{chat.messages[chat.messages.length - 1].body}</p>
                    <p>
                      {chat.messages[chat.messages.length - 1].createdAt
                        .substring(0, 19)
                        .replace("T", " ")}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="col-10">
        <div
          ref={messageContainer}
          className="overflow-auto pb-2 text-center"
          style={{ height: "calc(100vh - 104px)" }}
          onScroll={() => {
            handleScroll();
          }}
        >
          {currentChatId &&
            getChatById(chats, currentChatId).messages.length <
              getChatById(chats, currentChatId).totalCount && (
              <Button
                onClick={() => {
                  fetchAndSetMessages(
                    true,
                    getChatById(chats, currentChatId).messages[0].createdAt
                  );
                }}
              >
                Load more
              </Button>
            )}
          {currentChatId &&
            getChatById(chats, currentChatId).messages.map((value) => (
              <div
                className={
                  "border border-dark rounded p-2 my-2" +
                  (value.senderId === user.id ? " text-right" : " text-left")
                }
                key={value.id}
              >
                <div>{value.body}</div>
                {value.createdAt.substring(0, 19).replace(/[T,]/, " ")}
              </div>
            ))}
        </div>

        {showScrollButton ? (
          <Button
            onClick={() =>
              (messageContainer.current.scrollTop =
                messageContainer.current.scrollHeight)
            }
            style={{ position: "absolute", right: "50px", bottom: "60px" }}
          >
            Scroll
          </Button>
        ) : (
          <div />
        )}

        {currentChatId ? (
          <Form onSubmit={sendMessage}>
            <FormControl
              value={messageForm}
              onChange={handleChange}
              placeholder="Enter message..."
              autoFocus
            ></FormControl>
          </Form>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
