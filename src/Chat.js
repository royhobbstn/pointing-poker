import * as React from 'react';
import { Modal } from 'semantic-ui-react';
import useChat from './useChat';

export function Chat({ props }) {
  const { roomId } = props.match.params;
  const { messages, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = React.useState('');

  // value in message textarea
  const handleNewMessageChange = event => {
    setNewMessage(event.target.value);
  };

  const pressEnter = event => {
    if (event.charCode === 13) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    sendMessage(newMessage, roomId);
    setNewMessage('');
  };

  return (
    <React.Fragment>
      <h1>Room: {roomId}</h1>
      <div role="ol">
        {messages.map((message, i) => (
          <div role="li" key={i}>
            <span style={{ color: 'red' }}>{message.senderAlias}</span>
            <span style={{ marginLeft: '10px' }}>{message.body}</span>
          </div>
        ))}
      </div>
      <textarea
        value={newMessage}
        onChange={handleNewMessageChange}
        onKeyPress={pressEnter}
        placeholder="Write message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </React.Fragment>
  );
}
