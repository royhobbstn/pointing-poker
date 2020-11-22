import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { Game } from './Game';
import { Chat } from './Chat';
import socketIOClient from 'socket.io-client';

const Room = ({ match, roomNameLabel, updateRoomNameLabel }) => {
  const socketRef = React.useRef();
  const roomName = match.params.roomId;

  React.useEffect(() => {
    socketRef.current = socketIOClient({
      query: { roomName },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomName]);

  // keep name in menu in sync with actual room name
  React.useEffect(() => {
    if (!roomNameLabel) {
      updateRoomNameLabel(roomName);
    }
  }, [roomName, roomNameLabel, updateRoomNameLabel]);

  return (
    <Grid>
      {socketRef.current ? (
        <Grid.Row>
          <Grid.Column width={9}>
            <Game socketRef={socketRef} />
          </Grid.Column>
          <Grid.Column width={7}>
            <Chat socketRef={socketRef} />
          </Grid.Column>
        </Grid.Row>
      ) : null}
    </Grid>
  );
};

export default Room;
