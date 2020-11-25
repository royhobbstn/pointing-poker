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
  const { roomName, userName, userRole, colorChoice } = socket.handshake.query;
  socket.join(roomName);

  // if room doesn't exist.  set it up.
  if (!roomData[roomName]) {
    roomData[roomName] = {};
    const room = roomData[roomName];
    room.lastModified = Date.now(); // unix timestamp
    room.aliases = {}; // { socketId: alias }
    room.colors = {};
    room.roles = {};
    room.players = []; // array of socketIds
    room.selections = {}; // {socketId: value, socketId: value},
    room.mode = 'hidden'; // 'revealed' | 'hidden'
  }

  // okay here, not okay everywhere else
  roomData[roomName].aliases[socket.id] = userName;
  roomData[roomName].colors[socket.id] = colorChoice;
  roomData[roomName].roles[socket.id] = userRole;
  roomData[roomName].players.push(socket.id);

  // new player, say hello everyone!
  console.log('emitting!');
  console.log(Date.now());
  io.in(roomName).emit('gameData', roomData[roomName]);

  io.in(roomName).emit(CHAT, {
    body: `${roomData[roomName].aliases[socket.id]} has connected`,
    senderId: '', // blank here indicates moderator italic grey text in chat room
    userName: '',
    userRole: '',
    colorChoice: '',
  });

  // Listen for new messages
  socket.on(CHAT, message => {
    // temp
    roomData[roomName].aliases[socket.id] = message.userName;
    roomData[roomName].colors[socket.id] = message.colorChoice;
    roomData[roomName].roles[socket.id] = message.userRole;
    // --
    roomData[roomName].lastModified = Date.now();
    io.in(roomName).emit(CHAT, message);
  });

  socket.on('showAll', message => {
    // temp
    roomData[roomName].aliases[socket.id] = message.userName;
    roomData[roomName].colors[socket.id] = message.colorChoice;
    roomData[roomName].roles[socket.id] = message.userRole;
    // --
    roomData[roomName].lastModified = Date.now();
    roomData[roomName].mode = 'revealed';
    io.in(roomName).emit('gameData', roomData[roomName]);
  });

  socket.on('updateSelectedValue', message => {
    // temp
    roomData[roomName].aliases[socket.id] = message.userName;
    roomData[roomName].colors[socket.id] = message.colorChoice;
    roomData[roomName].roles[socket.id] = message.userRole;
    // --
    roomData[roomName].lastModified = Date.now();
    roomData[roomName].selections[socket.id] = message.body;
    io.in(roomName).emit('gameData', roomData[roomName]);
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
    roomData[roomName].players = roomData[roomName].players.filter(d => d !== socket.id);

    io.in(roomName).emit(CHAT, {
      body: `${roomData[roomName].aliases[socket.id]} has disconnected`,
      senderId: '', // blank here indicates moderator italic grey text in chat room
      userName: '',
      userRole: '',
      colorChoice: '',
    });
    io.in(roomName).emit('gameData', roomData[roomName]);

    socket.leave(roomName);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
