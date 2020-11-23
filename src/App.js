import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Room from './Room';
import MainMenu from './MainMenu';

function App() {
  const [roomNameLabel, updateRoomNameLabel] = React.useState('');

  return (
    <React.Fragment>
      <MainMenu roomNameLabel={roomNameLabel} />
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route
            exact
            path="/:roomId"
            render={props => (
              <Room
                {...props}
                roomNameLabel={roomNameLabel}
                updateRoomNameLabel={updateRoomNameLabel}
              />
            )}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
