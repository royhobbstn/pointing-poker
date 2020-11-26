const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const port = process.env.PORT || 4000;

const app = express();

app.use(express.static('build'));

app.get('*', function (req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, '../build/') });
});

const server = http.createServer(app);
const io = socketIo(server);

const roomData = {};
cleanUpRoomData();

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

  // Listen for new messages
  socket.on(CHAT, message => {
    roomData[roomName].lastModified = Date.now();
    io.in(roomName).emit(CHAT, message);
  });

  socket.on('announceConnection', () => {
    roomData[roomName].lastModified = Date.now();

    // officially add player
    roomData[roomName].players.push(socket.id);

    // a new non-observer user may push this back into hidden state
    roomData[roomName].mode = figureRevealed(roomData[roomName]) ? 'revealed' : 'hidden';

    // update everyones game data (mostly for newly connected user)
    sendToEveryone(io, roomName, addStats(roomData[roomName]));

    // new player, say hello everyone!
    io.in(roomName).emit(CHAT, {
      body: `${roomData[roomName].aliases[socket.id]} has connected`,
      senderId: '', // blank here indicates moderator italic grey text in chat room
    });
  });

  socket.on('showAll', message => {
    roomData[roomName].lastModified = Date.now();
    roomData[roomName].showAll = message.body;
    const withStats = addStats(roomData[roomName]);
    io.in(roomName).emit('gameData', withStats);
  });

  socket.on('clearAll', () => {
    roomData[roomName].lastModified = Date.now();
    roomData[roomName].mode = 'hidden';
    roomData[roomName].showAll = false;
    Object.keys(roomData[roomName].selections).forEach(key => {
      roomData[roomName].selections[key] = 'unselected';
    });
    const withStats = addStats(roomData[roomName]);
    io.in(roomName).emit('gameData', withStats);
  });

  socket.on('updateSettings', message => {
    roomData[roomName].lastModified = Date.now();

    const oldUserName = roomData[roomName].aliases[socket.id];
    if (oldUserName !== message.userName) {
      roomData[roomName].aliases[socket.id] = message.userName;
      io.in(roomName).emit(CHAT, {
        body: `--${oldUserName}-- has changed their name to: --${message.userName}--`,
        senderId: '', // blank here indicates moderator italic grey text in chat room
      });
    }

    const oldRole = roomData[roomName].roles[socket.id];
    if (oldRole !== message.userRole) {
      roomData[roomName].roles[socket.id] = message.userRole;
      io.in(roomName).emit(CHAT, {
        body: `--${message.userName}-- has changed their role from: --${oldRole}-- to: --${message.userRole}--`,
        senderId: '', // blank here indicates moderator italic grey text in chat room
      });
    }

    roomData[roomName].colors[socket.id] = message.colorChoice;
    roomData[roomName].mode = figureRevealed(roomData[roomName]) ? 'revealed' : 'hidden';

    sendToEveryone(io, roomName, addStats(roomData[roomName]));
  });

  socket.on('updateSelectedValue', message => {
    roomData[roomName].lastModified = Date.now();
    if (roomData[roomName].selections[socket.id] === message.body) {
      roomData[roomName].selections[socket.id] = 'unselected';
    } else {
      roomData[roomName].selections[socket.id] = message.body;
    }

    roomData[roomName].mode = figureRevealed(roomData[roomName]) ? 'revealed' : 'hidden';

    sendToEveryone(io, roomName, addStats(roomData[roomName]));
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    roomData[roomName].lastModified = Date.now();

    console.log(`Client ${socket.id} disconnected`);
    roomData[roomName].players = roomData[roomName].players.filter(d => d !== socket.id);

    // a departing player may push this to revealed state
    roomData[roomName].mode = figureRevealed(roomData[roomName]) ? 'revealed' : 'hidden';

    io.in(roomName).emit(CHAT, {
      body: `${roomData[roomName].aliases[socket.id]} has disconnected`,
      senderId: '', // blank here indicates moderator italic grey text in chat room
    });

    sendToEveryone(io, roomName, addStats(roomData[roomName]));

    socket.leave(roomName);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

function sendToEveryone(io, roomName, data) {
  if (data.mode === 'revealed' || data.showAll) {
    io.in(roomName).emit('gameData', data);
  } else {
    // obscure selections so they cant peek at network tab traffic
    for (let player of data.players) {
      // copy this structure or else we're in a world of trouble
      const copy = JSON.parse(JSON.stringify(data));
      for (let selectionKey of Object.keys(copy.selections)) {
        if (selectionKey !== player) {
          const selection = copy.selections[selectionKey];
          // a numeric value we will obscure by calling it 'selected'
          if (selection !== 'selected' && selection !== 'unselected') {
            copy.selections[selectionKey] = 'selected';
          }
        }
      }
      io.to(player).emit('gameData', copy);
    }
  }
}

function figureRevealed(data) {
  // figure out if this triggers 'revealed' (if everyone has selected)

  return data.players.every(player => {
    // if you are an observer, you dont factor into this
    const role = data.roles[player];
    if (role === 'observer') {
      return true;
    }

    return data.selections[player] !== 'unselected';
  });
}

function addStats(input) {
  const data = JSON.parse(JSON.stringify(input));

  if (data.mode === 'revealed' || data.showAll) {
    let developerCount = 0;
    let developerPoints = 0;

    let testerCount = 0;
    let testerPoints = 0;

    // calc Stats
    data.players.forEach(player => {
      if (data.roles[player] === 'developer') {
        if (data.selections[player] !== 'unselected') {
          developerCount++;
          developerPoints += Number(data.selections[player]);
        }
      } else if (data.roles[player] === 'tester') {
        if (data.selections[player] !== 'unselected') {
          testerCount++;
          testerPoints += Number(data.selections[player]);
        }
      }
    });
    data.stats = {
      developerAverage: developerCount ? (developerPoints / developerCount).toFixed(1) : null,
      testerAverage: testerCount ? (testerPoints / testerCount).toFixed(1) : null,
      totalAverage:
        developerCount + testerCount
          ? ((developerPoints + testerPoints) / (developerCount + testerCount)).toFixed(1)
          : null,
    };
  } else {
    data.stats = null;
  }

  return data;
}

function cleanUpRoomData() {
  // every 5 minutes, clean up all sessions older than an hour
  setInterval(() => {
    for (let roomKey of Object.keys(roomData)) {
      const time = Date.now();
      const elapsed = time - roomData[roomKey].lastModified;
      if (elapsed > 3600000) {
        delete roomData[roomKey];
      }
    }
  }, 300000);
}
