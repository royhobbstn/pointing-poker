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
          <p style={{ width: '100%', maxWidth: '250px', display: 'inline-block' }}>
            Developer Avg:{' '}
            <span style={{ fontWeight: 'bold', float: 'right' }}>
              {stats.developerAverage || '----'}
            </span>
          </p>
        </div>

        <div>
          <p style={{ width: '100%', maxWidth: '250px', display: 'inline-block' }}>
            Tester Avg:{' '}
            <span style={{ fontWeight: 'bold', float: 'right' }}>
              {stats.testerAverage || '----'}
            </span>
          </p>
        </div>
        <hr />
        <div>
          <p style={{ width: '100%', maxWidth: '250px', display: 'inline-block' }}>
            Total Avg:{' '}
            <span style={{ fontWeight: 'bold', float: 'right' }}>
              {stats.totalAverage || '----'}
            </span>
          </p>
        </div>
      </Card.Content>
    </Card>
  );
};

export default StatsContainer;
