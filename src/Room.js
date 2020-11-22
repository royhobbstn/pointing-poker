import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Game } from './Game';
import { Chat } from './Chat';

const Room = props => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={8}>
          <Game props={props} />
        </Grid.Column>
        <Grid.Column width={8}>
          <Chat props={props} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Room;
