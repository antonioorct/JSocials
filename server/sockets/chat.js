const Chat = function (app, socket) {
  this.app = app;
  this.socket = socket;

  this.handler = {
    message: message.bind(this, this, this.socket),
  };
};

const message = (_, socket, message) =>
  socket.to(message.userId).emit(message.content);

module.exports = Chat;
