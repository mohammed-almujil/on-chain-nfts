import Web3 from 'web3';
let PROVIDER_URL: any = process.env['PROVIDER_URL'];
const web3 = new Web3(PROVIDER_URL);
import { NFT } from '../models';
import * as ABIs from './ABI';
import { Log } from './models';

let options721 = {
    topics: [
        web3.eth.abi.encodeEventSignature('Transfer(address,address,uint256)')
    ]
};

// let options1155 = {
//     topics: [
//         web3.eth.abi.encodeEventSignature('TransferSingle(address,address,address,uint256,uint256)')
//     ]
// };

async function getNFTs(_blockNumber: string | number) {

    const blockNumber = await validateBlockNumber(_blockNumber)
    console.log('looking for topic: ' + options721.topics[0])
    const options = {
        fromBlock: blockNumber,
        toBlock: blockNumber,
        options721,
    };
    let logs: Log[] = [];
    logs = await web3.eth.getPastLogs(options);
    return parseLogs(logs);

}


async function parseLogs(logs: Log[]) {

    let NFTs: NFT[] = [];
    console.log('Processing ' + logs.length + ' logs')
    for (let x = 0; x < logs.length; x++) {

        const ERC721NFT = parseERC721(logs[x]);
        if (ERC721NFT) {
            NFTs.push(ERC721NFT)
        }

        // const txValid = await validateTX(logs[x].transactionHash);
        // if (txValid) {
        //     const ERC721NFT = parseERC721(logs[x]);
        //     if (ERC721NFT) {
        //         NFTs.push(ERC721NFT)
        //     }
        // } else {
        //     return; 
        // }
    }
    return NFTs;
}

function parseERC721(log: Log) {

    if (log.topics[0] === options721.topics[0] && log.topics.length == 4) {

        let transaction = web3.eth.abi.decodeLog(ABIs.ERC721, log.data, [log.topics[1], log.topics[2], log.topics[3]]);

        return new NFT({
            nft_type: 'ERC721',
            tx_type: (transaction.from === '0x0000000000000000000000000000000000000000') ? 'mint' : 'transfer',
            block_number: log.blockNumber,
            transaction_hash: log.transactionHash,
            chain: 'ethereum',
            from: transaction.from,
            to: transaction.to,
            token_contract: log.address,
            token_id: transaction.tokenId,
        })
    }
}
async function validateBlockNumber(blockNumber: any) {
    if (isNaN(blockNumber)) {
        const block = await web3.eth.getBlock('latest');
        blockNumber = block.number - 100;
        console.log('block number:' + blockNumber + ' with 100 block confirmation');
    }

    console.log('block number:' + blockNumber);
    return blockNumber;
}

async function validateTX(transactionHash: string) {
    const txReceipt = await web3.eth.getTransactionReceipt(transactionHash)
    if (!txReceipt) {
        console.log(transactionHash + ' is not finalized, try again later')
        return false
    } else {
        if (!txReceipt.status) {
            console.log('TX hash: ' + transactionHash + ' failed, skipping');
            return false;
        }
    }
    return true;
}

export { getNFTs };

