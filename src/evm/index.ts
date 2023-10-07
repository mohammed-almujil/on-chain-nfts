import Web3 from 'web3'
import { NFT, type NFTOptions, TX_TYPE, MetadataResponse } from '../models'
import * as ABIs from './ABI'
import { type Log } from './models'
import { getMetaData } from '../services'
import { Contract } from 'web3-eth-contract'

const web3 = new Web3()
const transfer721 = web3.utils.sha3('Transfer(address,address,uint256)');
const singleTransfer1155 = web3.utils.sha3('TransferSingle(address,address,address,uint256,uint256)')
const multiTransfer1155 = web3.utils.sha3('TransferBatch(address,address,address,uint256[],uint256[])')


async function getNFTs(nftOptions: NFTOptions) {

  const NFTs: NFT[] = []
  const erc721NFTs = await getERC721(nftOptions);
  NFTs.push(...erc721NFTs);
  const Erc1155NFTs = await getERC1155(nftOptions)
  NFTs.push(...Erc1155NFTs);

  return NFTs
}
async function getERC721(nftOptions: NFTOptions) {

  const blockNumber = await validateBlockNumber(nftOptions.blockNumber)
  const options = {
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [transfer721]
  }
  let logs: Log[] = []
  logs = await web3.eth.getPastLogs(options)

  const NFTs: NFT[] = []
  for (let x = 0; x < logs.length; x++) {
    if (logs[x].topics[0] === transfer721 && logs[x].topics.length == 4) {
      const ERC721NFT = await parseERC721Log(logs[x])
      if (ERC721NFT != null) {
        NFTs.push(ERC721NFT)
      }
    }
  }
  console.log('found ', NFTs.length, ' ERC721 NFTs');

  return NFTs
}
async function getERC1155(nftOptions: NFTOptions) {
  const blockNumber = await validateBlockNumber(nftOptions.blockNumber)

  const NFTs: NFT[] = []
  const Single1155NFTs = await getSingleERC1155Logs(blockNumber)
  NFTs.push(...Single1155NFTs);
  const Multi1155NFTs = await getMultiERC1155Logs(blockNumber)
  NFTs.push(...Multi1155NFTs)

  return NFTs
}
async function getSingleERC1155Logs(blockNumber: any) {

  const NFTs: NFT[] = []
  const options = {
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [singleTransfer1155]
  }
  let logs: Log[] = []
  logs = await web3.eth.getPastLogs(options)
  console.log('found ', logs.length, ' single 1155 logs');

  for (let x = 0; x < logs.length; x++) {
    if (logs[x].topics[0] === singleTransfer1155 && logs[x].topics.length == 4) {
      const ERC1155NFT = await parseSingleERC1155Log(logs[x])
      if (ERC1155NFT != null) {
        NFTs.push(ERC1155NFT)
      }
    }
  }
  return NFTs
}
async function getMultiERC1155Logs(blockNumber: any) {

  const NFTs: NFT[] = []

  const options = {
    fromBlock: blockNumber,
    toBlock: blockNumber,
    topics: [multiTransfer1155]
  }
  let logs: Log[] = []
  logs = await web3.eth.getPastLogs(options)
  console.log('found ', logs.length, ' multi 1155 logs');

  for (let x = 0; x < logs.length; x++) {
    if (logs[x].topics[0] === multiTransfer1155 && logs[x].topics.length == 4) {
      const ERC1155NFT = await parseMultiERC1155Log(logs[x])
      if (ERC1155NFT) {
        NFTs.push(...ERC1155NFT)
      }
    }
  }

  return NFTs
}
async function parseERC721Log(log: Log) {
  const transaction = web3.eth.abi.decodeLog(ABIs.ERC721Transfer, log.data, [
    log.topics[1],
    log.topics[2],
    log.topics[3]
  ])
  const txType = getTXType(transaction)
  console.log('ERC721', 'address:', log.address, 'token_id:', transaction.tokenId, 'txHash:', log.transactionHash)
  const erc721Contract = new web3.eth.Contract(ABIs.ERC721, log.address)
  const uri = await erc721Contract.methods.tokenURI(transaction.tokenId).call().catch((err: any) => {
    //console.log('TokenURI not found')
  })
  console.log('original uri:', uri)
  const metadata = await getMetaData(uri)

  return new NFT({
    nft_type: 'ERC-721',
    tx_type: TX_TYPE[txType],
    block_number: log.blockNumber,
    transaction_hash: log.transactionHash,
    from: transaction.from,
    to: transaction.to,
    token_contract: log.address,
    token_id: transaction.tokenId,
    token_uri: uri,
    metadata_fetch_uri: uri,
    metadata
  })
}
async function parseSingleERC1155Log(log: Log) {
  const transaction = web3.eth.abi.decodeLog(
    ABIs.ERC1155TransferSingle,
    log.data,
    [log.topics[1], log.topics[2], log.topics[3]]
  )
  const txType = getTXType(transaction)
  console.log('ERC1155 Single', 'address:', log.address, 'token_id:', transaction.id, 'txHash:', log.transactionHash)
  const ercSingle1155Contract = new web3.eth.Contract(ABIs.ERC1155, log.address)
  let originalUri = await ercSingle1155Contract.methods.uri(transaction.id).call().catch((err: any) => {
    //console.log('TokenURI not found using uri function call')
  })

  if (!originalUri) {
    originalUri = await getUriFromEvent(ercSingle1155Contract, transaction.id)
  }

  console.log('original uri:', originalUri)

  let uri = replaceUriSubstitution(originalUri, transaction.id, 'standard')

  let metadataResponse: MetadataResponse = await getMetaData(uri)

  if (!metadataResponse.metadata) {
    uri = replaceUriSubstitution(originalUri, transaction.id, 'nonstandard')
    metadataResponse = await getMetaData(uri)
  }

  return new NFT({
    nft_type: 'ERC-1155',
    tx_type: TX_TYPE[txType],
    block_number: log.blockNumber,
    transaction_hash: log.transactionHash,
    from: transaction.from,
    to: transaction.to,
    token_contract: log.address,
    token_id: transaction.id,
    token_value: transaction.value,
    token_uri: originalUri,
    metadata_fetch_uri: metadataResponse.metadataFetchUri,
    metadata: metadataResponse.metadata
  })
}
async function parseMultiERC1155Log(log: Log) {
  const transaction = web3.eth.abi.decodeLog(
    ABIs.ERC1155TransferMulti,
    log.data,
    [log.topics[1], log.topics[2], log.topics[3]]
  )
  let NFTs: NFT[] = [];

  for (let i = 0; i < transaction.ids.length; i++) {
    const txType = getTXType(transaction)
    console.log('ERC1155 Multiple', 'address:', log.address, 'token_id:', transaction.ids[i], 'txHash:', log.transactionHash)
    const ercMulti1155Contract = new web3.eth.Contract(ABIs.ERC1155, log.address)
    let originalUri = await ercMulti1155Contract.methods.uri(transaction.ids[i]).call().catch((err: any) => {
      //console.log('TokenURI not found using uri function call')
    })

    if (!originalUri) {
      originalUri = await getUriFromEvent(ercMulti1155Contract, transaction.ids[i])
    }
    console.log('original uri:', originalUri)

    let uri = replaceUriSubstitution(originalUri, transaction.ids[i], 'standard')
    let metadata = await getMetaData(uri)

    if (!metadata) {
      uri = replaceUriSubstitution(originalUri, transaction.ids[i], 'nonstandard')
      metadata = await getMetaData(uri)
    }

    NFTs.push(new NFT({
      nft_type: 'ERC-1155',
      tx_type: TX_TYPE[txType],
      block_number: log.blockNumber,
      transaction_hash: log.transactionHash,
      from: transaction.from,
      to: transaction.to,
      token_contract: log.address,
      token_id: transaction.ids[i],
      token_value: transaction.values[i],
      token_uri: originalUri,
      metadata_fetch_uri: uri,
      metadata
    }))
  }
  return NFTs;
}


async function getUriFromEvent(contract: Contract, id: any) {
  let events = [];
  try {
    events = await contract.getPastEvents('URI', {
      filter: { 'id': id },
      fromBlock: 0,
      toBlock: 'latest'
    });
    if (events.length) {
      return events[0].returnValues.value;
    }
  } catch (error: any) {

    return null;
  }
  return null;
}
// ref https://forum.openzeppelin.com/t/how-to-erc-1155-id-substitution-for-token-uri/3312/2
function replaceUriSubstitution(uri: any, token_id: any, operationType: string) {
  if (uri) {
    if (operationType === 'standard') {
      uri = uri.replace('{id}', Web3.utils.numberToHex(token_id).replace('0x', '').padStart(64, '0'));
    } else if (operationType === 'nonstandard') {
      uri = uri.replace('{id}', token_id);
    }
  }
  return uri
}
function getTXType(transaction: any) {
  if (transaction.from === '0x0000000000000000000000000000000000000000') {
    return TX_TYPE.MINT
  } else if (transaction.to === '0x0000000000000000000000000000000000000000') {
    return TX_TYPE.BURN
  }
  return TX_TYPE.TRANSFER
}
async function validateBlockNumber(blockNumber: any) {
  if (isNaN(blockNumber)) {
    const block = await web3.eth.getBlock('latest')
    blockNumber = block.number - 100
  }
  return blockNumber
}
function setProvider(provider: any) {
  web3.setProvider(provider)
}
export { getNFTs, getERC721, getERC1155, setProvider }
