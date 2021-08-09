const Chat = function (app, socket) {
  this.app = app;
  this.socket = socket;

  this.handler = {
    message: message.bind(this, this, this.socket),
    chat: chat.bind(this, this, this.socket),
  };
};

const message = (_, socket, message) => {
  console.log(message.userId);
  socket.to(message.userId).emit(message.content);
  console.log("Message: " + message.content);
};

const chat = (_, socket, userId) => {
  socket.join(userId);
  console.log(`User with id ${userId} joined.`);
};

module.exports = Chat;
