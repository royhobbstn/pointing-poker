import * as React from 'react';
import { Button } from 'semantic-ui-react';

export function GameRow({ color, selection, alias, isYou, mode }) {
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
        {selection === 'selected' ? (
          <Button.Group basic size="small">
            <Button className="btngrp-bar" disabled color="green">
              1
            </Button>
            <Button className="btngrp-bar" disabled style={{ color: 'orange' }}>
              2
            </Button>
            <Button className="btngrp-bar" disabled style={{ color: 'orange' }}>
              3
            </Button>
            <Button className="btngrp-bar">5</Button>
            <Button className="btngrp-bar">8</Button>
            <Button className="btngrp-bar">13</Button>
            <Button className="btngrp-bar">21</Button>
            <Button className="btngrp-bar">40</Button>
            <Button className="btngrp-bar">80</Button>
          </Button.Group>
        ) : null}
        {selection === 'unselected' ? (
          <Button.Group basic size="small">
            <Button className="btngrp-bar">1</Button>
            <Button className="btngrp-bar">2</Button>
            <Button className="btngrp-bar">3</Button>
            <Button className="btngrp-bar">5</Button>
            <Button className="btngrp-bar">8</Button>
            <Button className="btngrp-bar">13</Button>
            <Button className="btngrp-bar">21</Button>
            <Button className="btngrp-bar">40</Button>
            <Button className="btngrp-bar">80</Button>
          </Button.Group>
        ) : null}
        {selection !== 'unselected' && selection !== 'selected' && isYou === false ? (
          <Button.Group basic size="small">
            <Button className="btngrp-bar">1</Button>
            <Button className="btngrp-bar">2</Button>
            <Button className="btngrp-bar">3</Button>
            <Button className="btngrp-bar">5</Button>
            <Button className="btngrp-bar">8</Button>
            <Button className="btngrp-bar">13</Button>
            <Button className="btngrp-bar">21</Button>
            <Button className="btngrp-bar">40</Button>
            <Button className="btngrp-bar">80</Button>
          </Button.Group>
        ) : null}
        {selection !== 'unselected' && selection !== 'selected' && isYou === true ? (
          <Button.Group basic size="small">
            <Button className="btngrp-bar">1</Button>
            <Button className="btngrp-bar">2</Button>
            <Button className="btngrp-bar">3</Button>
            <Button className="btngrp-bar">5</Button>
            <Button className="btngrp-bar">8</Button>
            <Button className="btngrp-bar">13</Button>
            <Button className="btngrp-bar">21</Button>
            <Button className="btngrp-bar">40</Button>
            <Button className="btngrp-bar">80</Button>
          </Button.Group>
        ) : null}
      </div>
    </div>
  );
}
