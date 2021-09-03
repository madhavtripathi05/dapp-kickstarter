const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({ gasLimit: 800000000 }));

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts, factory, campaignAddress, campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '9000000' });

  await factory.methods
    .createCampaign('1', 'test', 'test', 'test')
    .send({ from: accounts[0], gas: '1000000' });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaign Factory Contract', () => {
  it('deploys a contract', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(manager, accounts[0]);
  });

  it('allows users to contribute ether and mark them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '2',
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert.ok(isContributor);
  });

  it('requires a minimum contribution to enter', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '0',
      });
      // intentionally failing the test iff the above line executes successfully
      assert(false);
    } catch (error) {
      assert.ok(error);
    }
  });

  it('allows a manger to create a request', async () => {
    const value = '100';
    await campaign.methods
      .createRequest('Buy MacBook', value, accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });
    const request = await campaign.methods.requests(0).call();
    // console.log(request);
    assert.strictEqual(request.value, value);
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    });
    await campaign.methods
      .createRequest('X', web3.utils.toWei('1', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });
    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    assert(balance > 100);
  });
});
