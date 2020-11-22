const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const roomData = {};

const CHAT = 'newChatMessage';

io.on('connection', socket => {
  console.log(`Client ${socket.id} connected`);

  // alias only used once, because it is changeable
  const { roomName, alias } = socket.handshake.query;
  socket.join(roomName);
  console.log('joining ' + roomName);
  console.log('alias', alias);

  // if room doesn't exist.  set it up.
  if (!roomData[roomName]) {
    roomData[roomName] = {};
    roomData[roomName].aliases = {};
  }

  roomData[roomName].aliases[socket.id] = alias;

  console.log(roomData[roomName]);

  io.in(roomName).emit(CHAT, {
    body: `${roomData[roomName].aliases[socket.id]} has connected`,
    senderId: '',
    senderAlias: '',
  });

  // Listen for new messages
  socket.on(CHAT, data => {
    io.in(roomName).emit(CHAT, data);
    roomData[roomName].aliases[socket.id] = data.senderAlias;
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
    io.in(roomName).emit(CHAT, {
      body: `${roomData[roomName].aliases[socket.id]} has disconnected`,
      senderId: '',
      senderAlias: '',
    });
    socket.leave(roomName);
  });

  socket.on('disconnect', function () {});
});

server.listen(port, () => console.log(`Listening on port ${port}`));
