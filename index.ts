import * as eth from './src/eth'
import { type NFTOptions, } from './src/models'
import { setIpfsHostnames, setArweaveHostnames } from './src/services'

async function getERC721(NFTOptions: NFTOptions) {
  const NFTs = await eth.getERC721(NFTOptions,);
  const result = NFTs.map((nft) => nft.toDict());
  return result;
}

async function getERC1155(NFTOptions: NFTOptions) {
  const NFTs = await eth.getERC1155(NFTOptions,);
  const result = NFTs.map((nft) => nft.toDict());
  return result;
}

async function getEthNFTs(NFTOptions: NFTOptions) {
  const NFTs = await eth.getNFTs(NFTOptions,);
  const result = NFTs.map((nft) => nft.toDict());
  return result;
}


module.exports.setArweaveHostnames = async (hostnames: string[]) => { setArweaveHostnames(hostnames,); }
module.exports.setIpfsHostnames = async (hostnames: string[]) => { setIpfsHostnames(hostnames,); }
module.exports.setEthProvider = async (provider: string) => { eth.setProvider(provider,); }
module.exports.getERC721 = async (options: NFTOptions) => await getERC721(options);
module.exports.getERC1155 = async (options: NFTOptions) => await getERC1155(options);
module.exports.getEthNFTs = async (options: NFTOptions) => await getEthNFTs(options);
