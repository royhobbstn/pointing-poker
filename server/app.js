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
    room.colors = {}; // {socketId: #hex },
    room.roles = {}; // {socketId: developer | tester | observer},
    room.players = []; // array of socketIds
    room.selections = {}; // {socketId: value, socketId: value},
    room.mode = 'hidden'; // 'revealed' | 'hidden'
    room.showAll = false; // boolean
  }

  // initial setup for a newly connected player
  roomData[roomName].aliases[socket.id] = userName;
  roomData[roomName].colors[socket.id] = colorChoice;
  roomData[roomName].roles[socket.id] = userRole;
  roomData[roomName].selections[socket.id] = 'unselected';
  roomData[roomName].players.push(socket.id);

  // Listen for new messages
  socket.on(CHAT, message => {
    roomData[roomName].lastModified = Date.now();
    io.in(roomName).emit(CHAT, message);
  });

  socket.on('announceConnection', message => {
    // new player, say hello everyone!
    io.in(roomName).emit(CHAT, {
      body: `${roomData[roomName].aliases[socket.id]} has connected`,
      senderId: '', // blank here indicates moderator italic grey text in chat room
    });

    // update everyones game data (mostly for newly connected user)
    roomData[roomName].lastModified = Date.now();
    io.in(roomName).emit('gameData', roomData[roomName]);
  });

  socket.on('showAll', message => {
    roomData[roomName].lastModified = Date.now();
    roomData[roomName].showAll = message.body;
    io.in(roomName).emit('gameData', roomData[roomName]);
  });

  socket.on('clearAll', () => {
    roomData[roomName].lastModified = Date.now();
    roomData[roomName].mode = 'hidden';
    roomData[roomName].showAll = false;
    Object.keys(roomData[roomName].selections).forEach(key => {
      roomData[roomName].selections[key] = 'unselected';
    });
    io.in(roomName).emit('gameData', roomData[roomName]);
  });

  socket.on('updateSettings', message => {
    roomData[roomName].aliases[socket.id] = message.userName;
    roomData[roomName].colors[socket.id] = message.colorChoice;
    roomData[roomName].roles[socket.id] = message.userRole;
    io.in(roomName).emit('gameData', roomData[roomName]);
  });

  socket.on('updateSelectedValue', message => {
    roomData[roomName].lastModified = Date.now();
    if (roomData[roomName].selections[socket.id] === message.body) {
      roomData[roomName].selections[socket.id] = 'unselected';
    } else {
      roomData[roomName].selections[socket.id] = message.body;
    }

    // figure out if this trigges SHOW (if everyone has selected)
    const allPicked = roomData[roomName].players.every(player => {
      return roomData[roomName].selections[player] !== 'unselected';
    });
    if (allPicked) {
      roomData[roomName].mode = 'revealed';
    }

    // calc stats for everyone

    io.in(roomName).emit('gameData', roomData[roomName]);
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
    roomData[roomName].players = roomData[roomName].players.filter(d => d !== socket.id);

    io.in(roomName).emit(CHAT, {
      body: `${roomData[roomName].aliases[socket.id]} has disconnected`,
      senderId: '', // blank here indicates moderator italic grey text in chat room
    });
    io.in(roomName).emit('gameData', roomData[roomName]);

    socket.leave(roomName);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
