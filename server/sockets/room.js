const Room = function (app, socket) {
  this.app = app;
  this.socket = socket;

  this.handler = {
    room: room.bind(this, this, this.socket),
  };
};

const room = (_, socket, userId) => socket.join(userId.toString());

module.exports = Room;
