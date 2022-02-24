const { Server } = require("socket.io");

var sockets = {};
sockets.init = function (server) {
  sockets.io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  sockets.io.on("connection", (socket) => {
    socket.on("SET_USERID", (data) => {
      socket.userId = data.userId;
    });
  });
  return sockets;
};

module.exports = sockets;
