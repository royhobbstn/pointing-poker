import * as React from 'react';
import { GameRow } from './GameRow.js';
import useGame from './useGame';
import { Button } from 'semantic-ui-react';

export function Game({ socketRef }) {
  const { gameData, sendMessage } = useGame(socketRef);

  if (!gameData) {
    return null;
  }

  const developers = gameData.players.filter(player => {
    return gameData.roles[player] === 'developer';
  });

  const testers = gameData.players.filter(player => {
    return gameData.roles[player] === 'tester';
  });

  function showAll() {
    sendMessage('showAll', null);
  }

  function updateSelectedValue(value) {
    sendMessage('updateSelectedValue', value);
  }

  console.log({ gameData });
  return (
    <div style={{ margin: '14px 0 14px 24px' }}>
      {developers.length ? (
        <div style={{ margin: '20px 5px' }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>DEVELOPERS</p>
          <div style={{ marginLeft: '15px' }}>
            {developers.map(player => {
              return (
                <GameRow
                  key={player}
                  color={gameData.colors[player]}
                  selection={gameData.selections[player]}
                  alias={gameData.aliases[player]}
                  isYou={player === socketRef.current.id}
                  mode={gameData.mode}
                  updateSelectedValue={updateSelectedValue}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {testers.length ? (
        <div style={{ margin: '20px 5px' }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>TESTERS</p>
          <div style={{ marginLeft: '15px' }}>
            {testers.map(player => {
              return (
                <GameRow
                  key={player}
                  color={gameData.colors[player]}
                  selection={gameData.selections[player]}
                  alias={gameData.aliases[player]}
                  isYou={player === socketRef.current.id}
                  mode={gameData.mode}
                  updateSelectedValue={updateSelectedValue}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      <div>
        <Button>Clear</Button>
        {gameData.mode === 'hidden' ? <Button onClick={() => showAll()}>Show</Button> : null}
      </div>
    </div>
  );
}
