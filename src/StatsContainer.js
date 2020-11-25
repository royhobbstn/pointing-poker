import * as React from 'react';
import { Card } from 'semantic-ui-react';

const StatsContainer = ({ stats }) => {
  if (!stats) {
    return null;
  }

  return (
    <Card>
      <Card.Content>
        <Card.Header size="medium">Results</Card.Header>
        <Card.Meta>
          <span>Statistics</span>
        </Card.Meta>
        <div style={{ marginTop: '25px' }}>
          <p style={{ width: '150px', display: 'inline-block' }}>Developer Average:</p>
          <span style={{ fontWeight: 'bold' }}>{stats.developerAverage || '----'}</span>
        </div>

        <div>
          <p style={{ width: '150px', display: 'inline-block' }}>Tester Average:</p>
          <span style={{ fontWeight: 'bold' }}>{stats.testerAverage || '----'}</span>
        </div>
        <hr />
        <div>
          <p style={{ width: '150px', display: 'inline-block' }}>Total Average:</p>
          <span style={{ fontWeight: 'bold' }}>{stats.totalAverage || '----'}</span>
        </div>
      </Card.Content>
    </Card>
  );
};

export default StatsContainer;
