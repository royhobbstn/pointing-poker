import * as React from 'react';
import useGame from './useGame';

export function Game({ socketRef }) {
  const { messages, sendMessage } = useGame(socketRef);

  return <div>Game</div>;
}
