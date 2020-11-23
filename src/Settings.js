import * as React from 'react';
import { Input, Button, Checkbox, Grid, Modal, Form } from 'semantic-ui-react';
import { ChromePicker } from 'react-color';

const Name = ({ settingsAreVisible, updateSettingsAreVisible }) => {
  const [nameInput, setNameInput] = React.useState(localStorage.getItem('userName'));
  const [roleValue, setRoleValue] = React.useState(localStorage.getItem('userRole'));
  const [colorValue, setColorValue] = React.useState(localStorage.getItem('colorChoice'));
  const [colorPickerVisible, setColorPickerVisible] = React.useState(false);

  if (!colorValue) {
    const color = getRandomColor();
    localStorage.setItem('colorChoice', color);
    setColorValue(color);
  }

  if (!roleValue) {
    localStorage.setItem('userRole', 'developer');
    setRoleValue('developer');
  }

  const updateNameInput = evt => {
    setNameInput(evt.target.value);
  };

  const clickButtonOkay = () => {
    localStorage.setItem('userName', nameInput);
    localStorage.setItem('userRole', roleValue);
    localStorage.setItem('colorChoice', colorValue);
    updateSettingsAreVisible(false);
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
          type="text"
          placeholder="Enter a User Name"
          value={nameInput}
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
                        checked={roleValue === 'developer'}
                        onChange={() => setRoleValue('developer')}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        radio
                        label="Test / QA"
                        name="checkboxRadioGroup"
                        value="tester"
                        checked={roleValue === 'tester'}
                        onChange={() => setRoleValue('tester')}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Checkbox
                        radio
                        label="Observer"
                        name="checkboxRadioGroup"
                        value="observer"
                        checked={roleValue === 'observer'}
                        onChange={() => setRoleValue('observer')}
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
                        backgroundColor: colorValue,
                      }}
                    ></span>
                  </Button>
                  {colorPickerVisible ? (
                    <div style={{ position: 'absolute', float: 'right', zIndex: '500' }}>
                      <ChromePicker
                        color={colorValue}
                        onChangeComplete={c => setColorValue(c.hex)}
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
        <Button disabled={!Boolean(nameInput)} onClick={() => clickButtonOkay()}>
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
