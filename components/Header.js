import React from 'react';
import { Header } from 'semantic-ui-react';
import { Link } from '../routes';

const header = function () {
  return (
    <Header as='h2' style={{ marginTop: '24px' }}>
      <Header.Content>
        <Link route='/'>
          <a className='item'>Dapp-KickStarter</a>
        </Link>
      </Header.Content>
    </Header>
  );
};

export default header;
