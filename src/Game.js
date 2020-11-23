import * as React from 'react';
import useGame from './useGame';
import { Button } from 'semantic-ui-react';

export function Game({ socketRef }) {
  const { messages, sendMessage } = useGame(socketRef);

  const data = {};
  data.lastModified = Date.now(); // unix timestamp
  data.aliases = { otherplayer: 'othAlias', tplayer: 'tAlias', oobserver: 'oAlias' }; // { socketId: alias }
  data.roles = { otherplayer: 'developer', tplayer: 'tester', oobserver: 'oAlias' };
  data.players = ['otherplayer', 'tplayer', 'oobserver']; // array of socketIds
  data.selections = {}; // {socketId: value, socketId: value},
  data.mode = 'revealed'; // 'revealed' | 'hidden'

  const developers = data.players.filter(player => {
    return data.roles[player] === 'developer';
  });

  const testers = data.players.filter(player => {
    return data.roles[player] === 'tester';
  });

  return (
    <div style={{ margin: '14px 24px' }}>
      <div>
        <Button>Clear</Button>
        <Button>ShowHideToggle</Button>
      </div>

      {developers.length ? (
        <div style={{ margin: '20px 5px' }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>Developers</p>
          <div style={{ marginLeft: '15px' }}>
            {developers.map(player => {
              return (
                <div>
                  {player}{' '}
                  <Button.Group basic size="small">
                    <Button icon="file" />
                    <Button icon="save" />
                    <Button icon="upload" />
                    <Button icon="download" />
                  </Button.Group>
                </div>
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
              return <div>{player}</div>;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
