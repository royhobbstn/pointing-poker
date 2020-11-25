import * as React from 'react';

const useGame = socketRef => {
  const [gameData, setGameData] = React.useState(null);

  // the only message type sent back by server
  React.useEffect(() => {
    console.log(Date.now());
    console.log(socketRef.current.id);
    socketRef.current.on('gameData', message => {
      console.log('got gameData message', message);
      // todo double check below
      setGameData(message);
    });
  }, [socketRef]);

  // generic message sender
  const sendMessage = (messageType, messageBody) => {
    // some messages should be reflected immediately in game data.
    // do that here

    // todo Later

    // then send the message to the server

    socketRef.current.emit(messageType, {
      body: messageBody,
      senderId: socketRef.current.id,
      userName: window.localStorage.userName,
      userRole: window.localStorage.userRole,
      colorChoice: window.localStorage.colorChoice,
    });
  };

  return { gameData, sendMessage };
};

export default useGame;
