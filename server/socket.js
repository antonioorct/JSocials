const path = require("path");
const fs = require("fs");
const http = require("http");
const socketIo = require("socket.io");

const SOCKETS_FOLDER = "sockets";

let io;

function initSockets(app) {
  io.sockets.on("connection", function (socket) {
    const sockets = [];
    const normalizedPath = path.join(__dirname, SOCKETS_FOLDER);

    fs.readdirSync(normalizedPath).forEach((file) =>
      sockets.push(require(`./${SOCKETS_FOLDER}/` + file))
    );

    const eventHandlers = sockets.map((Socket) => new Socket(app, socket));

    for (const category in eventHandlers) {
      const handler = eventHandlers[category].handler;

      for (const event in handler) {
        socket.on(event, handler[event]);
      }
    }
  });
}

function init(app) {
  const httpServer = http.Server(app);

  io = socketIo(httpServer, { cors: { origin: "*" } });

  initSockets(app);

  return httpServer;
}

function getIo() {
  return io;
}

module.exports = { io: getIo, init };
