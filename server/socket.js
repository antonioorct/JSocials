const path = require("path");
const fs = require("fs");

const SOCKETS_FOLDER = "sockets";

let io;
const allSockets = [];

function initSockets(app) {
  io.sockets.on("connection", function (socket) {
    const sockets = [];
    const normalizedPath = path.join(__dirname, SOCKETS_FOLDER);

    fs.readdirSync(normalizedPath).forEach((file) =>
      sockets.push(require(`./${SOCKETS_FOLDER}/` + file))
    );

    const eventHandlers = sockets.map((Socket) => new Socket(app, socket));

    // Bind events to handlers
    for (const category in eventHandlers) {
      const handler = eventHandlers[category].handler;

      for (const event in handler) {
        socket.on(event, handler[event]);
      }
    }

    // Keep track of the socket
    allSockets.push(socket);
  });
}

function init(app) {
  const http = require("http").Server(app);

  io = require("socket.io")(http, { cors: { origin: "*" } });

  io.listen(3001);

  initSockets(app);
}

function getIo() {
  return io;
}

module.exports = { io: getIo, init };
