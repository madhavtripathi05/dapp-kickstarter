import Web3 from 'web3';
let web3;
// Modern DApp Browsers
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(window.ethereum);
  console.log(web3.eth.accounts);
}
// we're on server or the user is not running metamask
else {
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/dd82e1f4b57f43d08159f6cb8a4ed8d5'
  );

  web3 = new Web3(provider);
  console.log(web3.eth.accounts);
}

export default web3;
