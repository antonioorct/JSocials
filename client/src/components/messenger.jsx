import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import http from "../services/httpService";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

export default function Messenger() {
  const [chats, setChats] = useState(null);
  const [messageForm, setMessageForm] = useState("");
  const [messages, setMessages] = useState(null);
  const [chatId, setChatId] = useState(null);
  const user = useContext(UserContext)[0];

  const fetchAndSetChats = async () => {
    const { data } = await http.get("http://localhost:3001/api/chats/23");

    setChats(data);
  };

  const fetchAndSetMessages = async () => {
    const { data } = await http.get(
      "http://localhost:3001/api/messages/" + chatId
    );

    setMessages(data);
  };

  useEffect(() => {
    fetchAndSetChats();
  }, []);

  useEffect(() => {
    fetchAndSetMessages();
  }, [user]);

  const handleChange = (e) => {
    setMessageForm(e.target.value);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    setMessages([
      ...messages,
      {
        id: messages[messages.length - 1].id + 1,
        senderId: user.id,
        body: messageForm,
        chatId: chatId,
        createdAt: new Date().toLocaleString(),
      },
    ]);
    setMessageForm("");

    console.log(new Date().toLocaleString().replace(",", ""));
    await http.post("http://localhost:3001/api/messages", {
      senderId: user.id,
      body: messageForm,
      chatId: chatId,
      createdAt: new Date().getTime(),
    });
  };

  return (
    <div className="row">
      <div className="col-2">
        {chats &&
          chats.map((chat) => {
            return (
              <div
                style={{ cursor: "pointer" }}
                className="border border-dark"
                key={chat.id}
                onClick={() => {
                  setChatId(chat.id);
                }}
              >
                <h5>{chat.name}</h5>
                <p>{chat.body}</p>
                <p>{chat.createdAt.substring(0, 19).replace("T", " ")}</p>
              </div>
            );
          })}
      </div>
      <div className="col-10">
        <Form onSubmit={sendMessage}>
          <FormControl
            value={messageForm}
            onChange={handleChange}
            placeholder="Enter message..."
          ></FormControl>
        </Form>
        {messages &&
          messages.map((value) => (
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
    </div>
  );
}
