import * as React from 'react';
import { GameRow } from './GameRow.js';
import useGame from './useGame';
import { Button } from 'semantic-ui-react';

export function Game({ socketRef }) {
  const { messages, sendMessage } = useGame(socketRef);

  console.log(socketRef.current.id);
  const data = {};
  data.lastModified = Date.now(); // unix timestamp
  data.aliases = {
    [socketRef.current.id]: 'thisisyou',
    otherplayer: 'othAlias',
    tplayer: 'tAlias',
    oobserver: 'oAlias',
  }; // { socketId: alias }
  data.colors = {
    [socketRef.current.id]: 'orange',
    otherplayer: 'red',
    tplayer: 'green',
    oobserver: 'blue',
  };
  data.roles = {
    [socketRef.current.id]: 'developer',
    otherplayer: 'developer',
    tplayer: 'tester',
    oobserver: 'oAlias',
  };
  data.players = [socketRef.current.id, 'otherplayer', 'tplayer', 'oobserver']; // array of socketIds
  data.selections = { [socketRef.current.id]: '3', otherplayer: 'selected', tplayer: 'unselected' }; // {socketId: value, socketId: value},
  data.mode = 'revealed'; // 'revealed' | 'hidden'

  const developers = data.players.filter(player => {
    return data.roles[player] === 'developer';
  });

  const testers = data.players.filter(player => {
    return data.roles[player] === 'tester';
  });

  return (
    <div style={{ margin: '14px 0 14px 24px' }}>
      <div>
        <Button>Clear</Button>
        <Button>ShowHideToggle</Button>
      </div>

      {developers.length ? (
        <div style={{ margin: '20px 5px' }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>DEVELOPERS</p>
          <div style={{ marginLeft: '15px' }}>
            {developers.map(player => {
              console.log(player);
              console.log(data.aliases[player]);
              console.log(data.colors[player]);
              return (
                <GameRow
                  key={player}
                  color={data.colors[player]}
                  selection={data.selections[player]}
                  alias={data.aliases[player]}
                  isYou={player === socketRef.current.id}
                  mode={data.mode}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {testers.length ? (
        <div style={{ margin: '20px 5px' }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>Testers</p>
          <div style={{ marginLeft: '15px' }}>
            {testers.map(player => {
              console.log(player);
              console.log(data.aliases[player]);
              console.log(data.colors[player]);
              return (
                <GameRow
                  key={player}
                  color={data.colors[player]}
                  selection={data.selections[player]}
                  alias={data.aliases[player]}
                  isYou={player === socketRef.current.id}
                  mode={data.mode}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
