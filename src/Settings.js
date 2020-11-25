import * as React from 'react';
import { Input, Button, Checkbox, Grid, Modal, Form } from 'semantic-ui-react';
import { ChromePicker } from 'react-color';

const Name = ({ settingsAreVisible, updateSettingsAreVisible, socketRef }) => {
  const [userName, updateUserName] = React.useState(localStorage.getItem('userName'));
  const [userRole, updateUserRole] = React.useState(localStorage.getItem('userRole'));
  const [colorChoice, updateColorChoice] = React.useState(localStorage.getItem('colorChoice'));
  const [colorPickerVisible, setColorPickerVisible] = React.useState(false);

  if (!colorChoice) {
    const color = getRandomColor();
    localStorage.setItem('colorChoice', color);
    updateColorChoice(color);
  }

  if (!userRole) {
    localStorage.setItem('userRole', 'developer');
    updateUserRole('developer');
  }

  const updateNameInput = evt => {
    updateUserName(evt.target.value);
  };

  const clickButtonOkay = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('colorChoice', colorChoice);
    updateSettingsAreVisible(false);
    socketRef.current.emit('updateSettings', { userName, userRole, colorChoice });
  };

  const pressEnter = event => {
    if (event.charCode === 13) {
      event.preventDefault();
      clickButtonOkay();
    }
  };

  return (
    <Modal size="tiny" open={settingsAreVisible}>
      <Modal.Header>Settings</Modal.Header>
      <div
        style={{
          margin: '40px auto',
          width: '400px',
          border: '1px dotted grey',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <Input
          label="Username: "
          type="text"
          placeholder="Enter a User Name"
          value={userName}
          onChange={updateNameInput}
          onKeyPress={pressEnter}
        />
        <div style={{ margin: '20px auto 0 auto' }}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <p>Choose a Role:</p>
                <div style={{ marginLeft: '15px' }}>
                  <Form>
                    <Form.Field>
                      <Checkbox
                        radio
                        label="Developer"
                        name="checkboxRadioGroup"
                        value="developer"
                        checked={userRole === 'developer'}
                        onChange={() => updateUserRole('developer')}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        radio
                        label="Test / QA"
                        name="checkboxRadioGroup"
                        value="tester"
                        checked={userRole === 'tester'}
                        onChange={() => updateUserRole('tester')}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        radio
                        label="Observer"
                        name="checkboxRadioGroup"
                        value="observer"
                        checked={userRole === 'observer'}
                        onChange={() => updateUserRole('observer')}
                      />
                    </Form.Field>
                  </Form>
                </div>
              </Grid.Column>
              <Grid.Column width={8}>
                <p>Chat Text Color:</p>
                <div style={{ marginLeft: '15px' }}>
                  <Button onClick={() => setColorPickerVisible(!colorPickerVisible)}>
                    <span
                      style={{
                        display: 'block',
                        width: '30px',
                        height: '20px',
                        backgroundColor: colorChoice,
                      }}
                    ></span>
                  </Button>
                  {colorPickerVisible ? (
                    <div style={{ position: 'absolute', float: 'right', zIndex: '500' }}>
                      <ChromePicker
                        color={colorChoice}
                        onChangeComplete={c => updateColorChoice(c.hex)}
                      />
                    </div>
                  ) : null}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
      <Modal.Actions>
        <Button disabled={!Boolean(userName)} onClick={() => clickButtonOkay()}>
          OK
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Name;

function getRandomColor() {
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 10);
  }
  return color;
}
