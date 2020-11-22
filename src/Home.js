import * as React from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();
  const [roomInput, setRoomInput] = React.useState('');

  const handleOnClick = () => {
    history.push(`/${roomInput}`);
  };

  const handleRoomNameChange = event => {
    setRoomInput(event.target.value);
  };

  const pressEnter = event => {
    if (event.charCode === 13) {
      event.preventDefault();
      handleOnClick();
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Room"
        value={roomInput}
        onKeyPress={pressEnter}
        onChange={handleRoomNameChange}
      />
      <button disabled={!Boolean(roomInput)} onClick={() => handleOnClick()}>
        OK
      </button>
    </div>
  );
};

export default Home;
