import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react';
import { AboutModal } from './AboutModal';
import Home from './Home';
import Room from './Room';
import Name from './Name';

function App() {
  const [roomNameLabel, updateRoomNameLabel] = React.useState('');
  const [userName, setUserName] = React.useState(localStorage.getItem('userName'));
  const [color, setColor] = React.useState(localStorage.getItem('colorChoice'));

  if (!color) {
    const color = getRandomColor();
    localStorage.setItem('colorChoice', color);
    setColor(color);
  }
  const [aboutModalOpen, updateAboutModalOpen] = React.useState(false);

  return (
    <React.Fragment>
      <AboutModal aboutModalOpen={aboutModalOpen} updateAboutModalOpen={updateAboutModalOpen} />
      <Menu>
        <Menu.Item header>Pointing Poker</Menu.Item>
        {roomNameLabel ? <Menu.Item header>Room: {roomNameLabel}</Menu.Item> : null}
        <Menu.Item position="right">
          <Button onClick={() => updateAboutModalOpen(true)}>About</Button>
        </Menu.Item>
      </Menu>
      {userName ? (
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
      ) : (
        <Name setUserName={setUserName} />
      )}
    </React.Fragment>
  );
}

export default App;

function getRandomColor() {
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 10);
  }
  return color;
}
