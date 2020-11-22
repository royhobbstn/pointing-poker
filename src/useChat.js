import { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';

const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage';

const useChat = roomId => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(null, {
      query: { roomId },
    });

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, message => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages(messages => [...messages, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = messageBody => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      senderAlias: window.localStorage.userName,
    });
  };

  return { messages, sendMessage };
};

export default useChat;
