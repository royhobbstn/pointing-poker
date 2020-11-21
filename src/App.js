import React, { useState, useEffect } from 'react';

const io = require('socket.io-client');
const socket = io('http://localhost:3011');

function App() {
  
  const [messageCount, setMessageCount] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [inRoom, setInRoom] = useState(false);
  
   useEffect(() => {

    if(inRoom) {
      console.log('joining room');
      socket.emit('room', {room: 'test-room'});
    }

    return () => {
      if(inRoom) {
        console.log('leaving room');
        socket.emit('leave room', {
          room: 'test-room'
        })
      }
    }
  });

  useEffect(() => {
    socket.on('receive message', payload => {
      setMessageCount(messageCount + 1);
      document.title = `${messageCount} new messages have been emitted`;
    });
  }, []); //only re-run the effect if new message comes in

  const handleSetTheme = () => {
    let newTheme;
    (theme === 'light')
      ? newTheme = 'dark'
      : newTheme = 'light';
    console.log('new theme: ' + newTheme);
    setTheme(newTheme);
  }

  const handleInRoom = () => {
    inRoom
      ? setInRoom(false)
      : setInRoom(true);
  }

  const handleNewMessage = () => {
    console.log('emitting new message');
    socket.emit('new message', {
      room: 'test-room'
    });
    setMessageCount(messageCount + 1);
  }

  return (
    <div >
      <header >

        <h1>
          {inRoom && `You Have Entered The Room` }
          {!inRoom && `Outside Room` }
        </h1>
        
        <p>{messageCount} messages have been emitted</p>

        {inRoom &&
        <button onClick={() => handleNewMessage()}>
          Emit new message
        </button>
        }

        <button onClick={() => handleSetTheme()}>
          Toggle Theme
        </button>

        <button onClick={() => handleInRoom()}>
          {inRoom && `Leave Room` }
          {!inRoom && `Enter Room` }
        </button>

      </header>
    </div>
  );
}

export default App;