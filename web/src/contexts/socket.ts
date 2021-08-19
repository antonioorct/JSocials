import { createContext } from "react";
import io from "socket.io-client";
import { BACKEND_URL } from "../constants/apiRoutes";

export const socket = io(BACKEND_URL);
export const SocketContext = createContext(socket);
