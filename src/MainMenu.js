import * as React from 'react';
import Settings from './Settings';
import { AboutModal } from './AboutModal';
import { Menu, Button, Icon, Header } from 'semantic-ui-react';

const MainMenu = ({ roomNameLabel }) => {
  const [aboutModalOpen, updateAboutModalOpen] = React.useState(false);
  const [settingsAreVisible, updateSettingsAreVisible] = React.useState(false);

  React.useEffect(() => {
    const userName = localStorage.getItem('userName');
    const colorChoice = localStorage.getItem('colorChoice');
    const userRole = localStorage.getItem('userRole');
    if (!userName || !colorChoice || !userRole) {
      updateSettingsAreVisible(true);
    }
  }, [settingsAreVisible, updateSettingsAreVisible]);

  return (
    <React.Fragment>
      <AboutModal aboutModalOpen={aboutModalOpen} updateAboutModalOpen={updateAboutModalOpen} />
      <Settings
        settingsAreVisible={settingsAreVisible}
        updateSettingsAreVisible={updateSettingsAreVisible}
      />
      <Menu>
        <Menu.Item header>
          <Header size="medium">Pointing Poker</Header>
        </Menu.Item>
        {roomNameLabel ? (
          <Menu.Item header>
            <span style={{ color: 'darkslategray' }}>Room:</span>&nbsp;&nbsp;
            <span style={{ color: 'gray' }}>{roomNameLabel}</span>
          </Menu.Item>
        ) : null}
        <Menu.Item position="right">
          <Button style={{ marginRight: '10px' }} icon onClick={() => updateAboutModalOpen(true)}>
            <Icon name="question circle outline" />
          </Button>
          <Button icon onClick={() => updateSettingsAreVisible(true)}>
            <Icon name="setting" />
          </Button>
        </Menu.Item>
      </Menu>
    </React.Fragment>
  );
};

export default MainMenu;
