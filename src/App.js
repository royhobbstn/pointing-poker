import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react';

import Home from './Home';
import Room from './Room';
import { AboutModal } from './AboutModal';

function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName'));
  const [nameInput, setNameInput] = React.useState('');
  const [aboutModalOpen, updateAboutModalOpen] = React.useState(false);

  const updateNameInput = evt => {
    setNameInput(evt.target.value);
  };

  const clickButtonOkay = () => {
    localStorage.setItem('userName', nameInput);
    setUserName(nameInput);
  };

  const pressEnter = event => {
    if (event.charCode === 13) {
      event.preventDefault();
      clickButtonOkay();
    }
  };

  return (
    <React.Fragment>
      <AboutModal aboutModalOpen={aboutModalOpen} updateAboutModalOpen={updateAboutModalOpen} />
      <Menu>
        <Menu.Item header>Pointing Poker</Menu.Item>
        <Menu.Item position="right">
          <Button onClick={() => updateAboutModalOpen(true)}>About</Button>
        </Menu.Item>
      </Menu>
      {userName ? (
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/:roomId" component={Room} />
          </Switch>
        </Router>
      ) : (
        <React.Fragment>
          <input type="text" value={nameInput} onChange={updateNameInput} onKeyPress={pressEnter} />
          <button disabled={!Boolean(nameInput)} onClick={() => clickButtonOkay()}>
            OK
          </button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default App;
