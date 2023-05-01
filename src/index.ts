import * as eth from './eth'
import { type NFTOptions, } from './models'
import { setIpfsHostnames, setArweaveHostnames } from './services'

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

async function setEthProvider (provider : string){
  eth.setProvider(provider)
}
export { setArweaveHostnames, setIpfsHostnames, setEthProvider, getERC721, getERC1155, getEthNFTs }