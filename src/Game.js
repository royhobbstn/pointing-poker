import React from 'react';
import { Modal } from 'semantic-ui-react';
import useGame from './useGame';

export function Game({ props }) {
  const { roomId } = props.match.params;
  const { messages, sendMessage } = useGame(roomId);

  return <div>Game</div>;
}
