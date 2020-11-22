import * as React from 'react';

const NEW_GAME_MESSAGE_EVENT = 'newGameMessage';

const useGame = socketRef => {
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    socketRef.current.on(NEW_GAME_MESSAGE_EVENT, message => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages(messages => [...messages, incomingMessage]);
    });
  }, []);

  const sendMessage = messageBody => {
    socketRef.current.emit(NEW_GAME_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      senderAlias: window.localStorage.userName,
    });
  };

  return { messages, sendMessage };
};

export default useGame;
