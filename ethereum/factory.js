import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
import { contractAddress } from '../package.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, contractAddress);

export default instance;
