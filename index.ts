import * as eth from './src/eth'
import {NFTOptions} from './src/models';

async function getERC721(NFTOptions: NFTOptions) {
     let NFTs = await eth.getERC721(NFTOptions.blockNumber)
     const result = NFTs.map((nft) => nft.toDict());
     return result
}

module.exports.setEthProvider = async (provider :string) => eth.setProvider(provider);
module.exports.getERC721 = async ({ blockNumber = 'latest' }) => await getERC721(new NFTOptions({ blockNumber: blockNumber, }));