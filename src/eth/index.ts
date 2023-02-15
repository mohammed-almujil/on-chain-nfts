import Web3 from 'web3';
const web3 = new Web3();

import { NFT,TX_TYPE, STORAGE_PREFIX } from '../models';
import * as ABIs from './ABI';
import { Log } from './models';

let options721 = {
    topics: [
        web3.eth.abi.encodeEventSignature('Transfer(address,address,uint256)')
    ]
};


async function getERC721(_blockNumber: string | number) {

    const blockNumber = await validateBlockNumber(_blockNumber)
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
        console.log(log.address,transaction.tokenId, log.transactionHash);
        const erc721Contract =  new web3.eth.Contract(ABIs.ERC721, log.address);
        
        const uri = await erc721Contract.methods.tokenURI(transaction.tokenId).call().catch((err:any) => {
                console.log(err.data, 'TokenURI not found');
           });
        if(!uri && txType != TX_TYPE.BURN){
            console.log('This is not a burn call, skipping');
            return;
        }

        return new NFT({
            nft_type: 'ERC721',
            tx_type: TX_TYPE[txType],
            block_number: log.blockNumber,
            transaction_hash: log.transactionHash,
            chain: 'ethereum',
            from: transaction.from,
            to: transaction.to,
            token_contract: log.address,
            token_id: transaction.tokenId,
            token_uri: uri,

        })
    }
}

async function getMetaData(uri:string) {
    
            // TO-DO Parse TOKEN-URI
                // TRIM SPACES
                    // ipfs://
                    // data:application/json;base64,eyJkZXNjcmlwdGlvbiI6IkdvIHRvIGh0dHBzOi8vZnJlZW5mdC54eXogZXZlcnkgZGF5IHRvIHVwZ3JhZGUgeW91ciBjYXJnbywgbWFpbnRhaW4geW91ciBzdHJlYWsgYW5kIHdpbiByZXdhcmRzLiIsImV4dGVybmFsX3VybCI6Imh0dHBzOi8vZnJlZW5mdC54eXoiLCJpbWFnZSI6Imh0dHBzOi8vYTJ2aDh2azZyNy5leGVjdXRlLWFwaS51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS9wcm9kL2RhaWx5X2NoZXN0X2ltYWdlLzI2IiwibmFtZSI6IkRhaWx5IENhcmdvICMyOTY2IiwiYXR0cmlidXRlcyI6W3sidHJhaXRfdHlwZSI6ICJTdHJlYWsiLCAidmFsdWUiOiIyNiJ9XX0
                    // https:// || http://
                    // ar://

}

function getTXType (transaction:any){
    if(transaction.from === '0x0000000000000000000000000000000000000000'){
        return TX_TYPE.MINT;
    } else if(transaction.to === '0x0000000000000000000000000000000000000000'){
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

