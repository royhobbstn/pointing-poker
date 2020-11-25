import * as React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export function GameRow({ color, selection, alias, isYou, mode, updateSelectedValue }) {
  console.log({ color, selection, alias, isYou, mode });
  return (
    <div>
      <div style={{ margin: '2px 0' }}>
        <span
          style={{
            fontWeight: 'bold',
            display: 'inline-block',
            width: '150px',
            color,
          }}
        >
          {alias}
        </span>
        <Icon
          style={{
            color: selection === 'unselected' ? 'grey' : 'green',
          }}
          disabled={selection === 'unselected'}
          name="star outline"
        />
        {isYou === false ? (
          <Button.Group basic size="small">
            <Button.Group basic size="small">
              {['1', '2', '3', '5', '8', '13', '21', '40', '80'].map(num => {
                return (
                  <Button className="btngrp-bar" disabled basic key={num}>
                    {num}
                  </Button>
                );
              })}
            </Button.Group>
          </Button.Group>
        ) : null}
        {isYou === true ? (
          <Button.Group basic size="small">
            {['1', '2', '3', '5', '8', '13', '21', '40', '80'].map(num => {
              return (
                <Button
                  key={num}
                  className="btngrp-bar"
                  basic
                  primary={selection === num}
                  onClick={() => updateSelectedValue(num)}
                >
                  {num}
                </Button>
              );
            })}
          </Button.Group>
        ) : null}
      </div>
    </div>
  );
}
