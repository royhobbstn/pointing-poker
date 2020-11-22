import React from 'react';

const Name = ({ setUserName }) => {
  const [nameInput, setNameInput] = React.useState('');

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
      <input type="text" value={nameInput} onChange={updateNameInput} onKeyPress={pressEnter} />
      <button disabled={!Boolean(nameInput)} onClick={() => clickButtonOkay()}>
        OK
      </button>
    </React.Fragment>
  );
};

export default Name;
