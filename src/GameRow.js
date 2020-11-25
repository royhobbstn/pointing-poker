import * as React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export function GameRow({ color, selection, alias, isYou, mode, updateSelectedValue, showAll }) {
  return (
    <div>
      <div style={{ margin: '6px 0 0 0' }}>
        <Icon
          style={{
            color: selection === 'unselected' ? 'grey' : 'green',
          }}
          disabled={selection === 'unselected'}
          name="star outline"
        />

        <span
          style={{
            lineHeight: '29px',
            marginLeft: '10px',
            fontWeight: 'bold',
            display: 'inline-block',
            width: '130px',
            color,
          }}
        >
          {alias}
        </span>

        {isYou === false && mode !== 'revealed' && !showAll ? (
          <Button.Group basic size="small">
            {['1', '2', '3', '5', '8', '13', '21', '40', '80'].map(num => {
              return (
                <Button key={num} className="btngrp-bar" disabled basic>
                  {num}
                </Button>
              );
            })}
          </Button.Group>
        ) : null}
        {isYou === true || mode === 'revealed' || showAll ? (
          <Button.Group basic size="small">
            {['1', '2', '3', '5', '8', '13', '21', '40', '80'].map(num => {
              return (
                <Button
                  key={num}
                  className={`btngrp-bar ${selection === num ? 'big-outline' : ''}`}
                  basic
                  disabled={isYou === false}
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
