import React, { Component } from 'react';
import { Card, Button, Grid } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
        style: { overflowWrap: 'break-word' },
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={10} mobile={16}>
              <h3>Ongoing Campaigns</h3>
              {this.renderCampaigns()}
            </Grid.Column>
            <Grid.Column computer={6} mobile={16}>
              <Link route='/campaigns/new'>
                <a className='item'>
                  <Button
                    floated='right'
                    content='Create Campaign'
                    icon='add circle'
                    secondary
                  ></Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignIndex;
