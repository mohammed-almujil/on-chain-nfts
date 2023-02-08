import * as dotEnv from 'dotenv'
dotEnv.config()
import * as eth from './src/eth'


async function getNFTs(blockNumber: string | number) {
     let NFTs = await eth.getNFTs(blockNumber)
     const result = NFTs.map((nft) => nft.toDict());

     console.log(result)
     console.log('found ' + result.length + ' NFTs')
     return result
}

getNFTs('latest');
