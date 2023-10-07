import * as evm from './evm'
import { type NFTOptions, } from './models'
import { setIpfsHostnames, setArweaveHostnames } from './services'

async function getERC721(NFTOptions: NFTOptions) {
  const NFTs = await evm.getERC721(NFTOptions,);
  const result = NFTs.map((nft) => nft.toDict());
  return result;
}

async function getERC1155(NFTOptions: NFTOptions) {
  const NFTs = await evm.getERC1155(NFTOptions,);
  const result = NFTs.map((nft) => nft.toDict());
  return result;
}

async function getEvmNFTs(NFTOptions: NFTOptions) {
  const NFTs = await evm.getNFTs(NFTOptions,);
  const result = NFTs.map((nft) => nft.toDict());
  return result;
}

async function setEvmProvider (provider : string){
  evm.setProvider(provider)
}
export { setArweaveHostnames, setIpfsHostnames, setEvmProvider, getERC721, getERC1155, getEvmNFTs }