import * as eth from './src/eth'
import { NFTOptions } from './src/models';
import { setIpfsHostnames, setArweaveHostnames } from './src/services'

async function getERC721(NFTOptions: NFTOptions) {
     let NFTs = await eth.getERC721(NFTOptions)
     const result = NFTs.map((nft) => nft.toDict());
     return result
}
module.exports.setArweaveHostnames = async (hostnames: string[]) => setArweaveHostnames(hostnames);
module.exports.setIpfsHostnames = async (hostnames: string[]) => setIpfsHostnames(hostnames);
module.exports.setEthProvider = async (provider: string) => eth.setProvider(provider);
module.exports.getERC721 = async (options: NFTOptions) => await getERC721(options);