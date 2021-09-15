import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {
  state = {
    value: '',
    errorMessage: '',
    request: this.props.request,
    isLoading: false,
    isError: false,
  };

  onApprove = async () => {
    this.setState({ isLoading: true, isError: false });
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods
        .approveRequest(this.props.id)
        .send({ from: accounts[0] });

      const request = await campaign.methods.requests(this.props.id).call();
      this.setState({ request: request });
    } catch (error) {
      this.setState({ errorMessage: error.message, isError: true });
    }

    this.setState({ isLoading: false });
  };

  onFinalize = async () => {
    this.setState({ isLoading: true, isError: false });
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      await campaign.methods
        .finalizeRequest(this.props.id)
        .send({ from: accounts[0] });

      const request = await campaign.methods.requests(this.props.id).call();
      this.setState({ request: request });
    } catch (e) {
      this.setState({ errorMessage: e.message, isError: true });
    }

    this.setState({ isLoading: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, approversCount } = this.props;
    const isRequestReadyToFinalize =
      this.state.request.approvalCount >= approversCount / 2;

    return (
      <Row
        disabled={this.state.request.isComplete}
        positive={isRequestReadyToFinalize && !this.state.request.isComplete}
      >
        <Cell>{id + 1}</Cell>
        <Cell>{this.state.request.description}</Cell>
        <Cell>{`${web3.utils.fromWei(
          this.state.request.value,
          'ether'
        )} Ether`}</Cell>
        <Cell>{this.state.request.recipient}</Cell>
        <Cell>{`${this.state.request.approvalCount}/${approversCount}`}</Cell>
        <Cell>
          {this.state.request.isComplete ||
          this.state.request.approvalCount == approversCount ? null : (
            <Button
              color='green'
              loading={this.state.isLoading}
              basic
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {this.state.request.isComplete ? (
            <h4>Request completed</h4>
          ) : (
            <Button
              loading={this.state.isLoading}
              color='teal'
              basic
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
