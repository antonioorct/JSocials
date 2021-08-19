import { FC, useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IMessage, IPost, IUser } from "../constants/models";
import routes from "../constants/routes";
import { SocketContext } from "../contexts/socket";
import { getUserId } from "../services/authServices";
import { getUserName } from "../utils/stringUtils";
import { notification } from "./Toast";

const Notifications: FC = () => {
  const socket = useContext(SocketContext);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const sockets = {
      post: (post: IPost) =>
        notification({
          onClick: () => {
            history.push(routes.home.href, { post: post });
          },
          title: "New post!",
          content: `From: ${getUserName(post.user)}`,
        }),
      message: (message: IMessage) =>
        notification({
          onClick: () =>
            history.push(routes.messenger.href, { user: message.user }),
          title: "New message!",
          content: `From: ${getUserName(message.user)}`,
        }),
      friend: (user: IUser) =>
        notification({
          onClick: () => history.push(routes.friendRequests.href),
          title: "New friend request!",
          content: `From: ${getUserName(user)}`,
        }),
    };

    socket.emit("room", getUserId());

    for (const [event, handler] of Object.entries(sockets))
      socket.on(event, handler);

    return () => Object.keys(sockets).forEach((event) => socket.off(event));
  }, [socket, location, history]);

  return null;
};

export default Notifications;
