import Web3 from 'web3';
const web3 = new Web3();

import { NFT, NFTOptions, TX_TYPE } from '../models';
import * as ABIs from './ABI';
import { Log } from './models';
import { requestMetadata } from '../services';

let options721 = {
    topics: [
        web3.eth.abi.encodeEventSignature('Transfer(address,address,uint256)')
    ]
};


async function getERC721(nftOptions: NFTOptions) {

    const blockNumber = await validateBlockNumber(nftOptions.blockNumber)
    const options = {
        fromBlock: blockNumber,
        toBlock: blockNumber,
        options721,
    };
    let logs: Log[] = [];
    logs = await web3.eth.getPastLogs(options);

    let NFTs: NFT[] = [];
    for (let x = 0; x < logs.length; x++) {
        const ERC721NFT = await parseERC721Log(logs[x]);
        if (ERC721NFT) {
            NFTs.push(ERC721NFT)
        }
    }
    return NFTs;
}


async function parseERC721Log(log: Log) {

    if (log.topics[0] === options721.topics[0] && log.topics.length == 4) {

        let transaction = web3.eth.abi.decodeLog(ABIs.ERC721Transfer, log.data, [log.topics[1], log.topics[2], log.topics[3]]);
        const txType = getTXType(transaction);
        console.log(log.address, transaction.tokenId, log.transactionHash);
        const erc721Contract = new web3.eth.Contract(ABIs.ERC721, log.address);
        const uri = await erc721Contract.methods.tokenURI(transaction.tokenId).call().catch((err: any) => {
            console.log('TokenURI not found');
        });

        const metadata = await getMetaData(uri);

        return new NFT({
            nft_type: 'ERC-721',
            tx_type: TX_TYPE[txType],
            block_number: log.blockNumber,
            transaction_hash: log.transactionHash,
            chain: 'ethereum',
            from: transaction.from,
            to: transaction.to,
            token_contract: log.address,
            token_id: transaction.tokenId,
            token_uri: uri,
            metadata: metadata,
        })
    }
}

async function getMetaData(uri: string) {

    if (!uri) return null;

    if (uri.startsWith('https://')) {
        return await requestMetadata(uri);
    } else if (uri.startsWith('http://')) {
        return await requestMetadata(uri);
    } else if (uri.startsWith('ipfs:/')) {
        console.log('ipfs')
    } else if (uri.startsWith('data:application/json;base64')) {
        console.log('base64')
    } else if (uri.startsWith('ar://')) {
        console.log('arweave')
    }
}


function getTXType(transaction: any) {
    if (transaction.from === '0x0000000000000000000000000000000000000000') {
        return TX_TYPE.MINT;
    } else if (transaction.to === '0x0000000000000000000000000000000000000000') {
        return TX_TYPE.BURN;
    }
    return TX_TYPE.TRANSFER;

}

async function validateBlockNumber(blockNumber: any) {
    if (isNaN(blockNumber)) {
        const block = await web3.eth.getBlock('latest');
        blockNumber = block.number - 100;
    }

    return blockNumber;
}

function setProvider(provider: any) {
    web3.setProvider(provider);
}



export { getERC721, setProvider };

