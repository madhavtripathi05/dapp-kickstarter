const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const compiledCampaignFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'absorb earth diesel congress inherit page unfold relax team taxi winner keep',
  'https://rinkeby.infura.io/v3/dd82e1f4b57f43d08159f6cb8a4ed8d5'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);
  const result = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({
      data: compiledCampaignFactory.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: '10000000' });

  console.log('Contract deployed to', result.options.address);
};

deploy();
