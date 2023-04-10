const onChainNFT = require('./src/')

async function test() {
  onChainNFT.setEthProvider(process.env.PROVIDER_URL);
  onChainNFT.setIpfsHostnames([
    'gateway.pinata.cloud',
    'cloudflare-ipfs.com',
    'ipfs-gateway.cloud',
    'gateway.ipfs.io',
    '4everland.io',
    'cf-ipfs.com',
    'ipfs.jpu.jp',
    'dweb.link'
  ]);
  onChainNFT.setArweaveHostnames([
    'arweave.net'
  ]);

  // ########### all NFTs ########### 
  await getNFTs('latest', 'Testing all NFT types in the latest block with 100 block confirmations', 'all');

  // ########### 1155 tests ########### 
  await getNFTs('latest', 'Testing get latest ERC1155 with 100 block confirmations', 'erc-1155');
  await getNFTs(16874683, 'Testing blocks with Transfer batch event 1', 'erc-1155');
  await getNFTs(16874466, 'Testing blocks with Transfer batch event 2', 'erc-1155');
  await getNFTs(16881743, 'Testing blocks with Transfer batch event with {id} substitution that was not done properly', 'erc-1155');


  // // ########### 721 tests ###########
  await getNFTs('latest', 'Testing latest block ERC721 with 100 block confirmations', 'erc-721');
  await getNFTs(16633190, 'Testing block with TXs that include no tokenURI', 'erc-721');
  await getNFTs(16640530, 'Testing block with TX that has token erc-721 burn', 'erc-721');
  await getNFTs(16740129, 'Testing block with over 300 base64 tokenURIs', 'erc-721');


  //await getNFT(16874458, 'Testing get 1155 with opensea uri with {id} substitution', 'erc-1155');
  async function getNFTs(blockNumber: any, message: string, type: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('-------------------------------------------');
    console.log(type+':' +message)
    if (type === 'erc-1155') {
      const result = await onChainNFT.getERC1155({ blockNumber: blockNumber });
      console.log(JSON.stringify(result));
      console.log('found ' + result.length + ' NFTs in block:' + blockNumber);
    } else if (type === 'erc-721') {
      const result = await onChainNFT.getERC721({ blockNumber: blockNumber });
      console.log(JSON.stringify(result));
      console.log('found ' + result.length + ' NFTs in block:' + blockNumber);
    }
    else if (type === 'all'){
      const result = await onChainNFT.getEthNFTs({ blockNumber: blockNumber });
      console.log(JSON.stringify(result));
      console.log('found ' + result.length + ' NFTs in block:' + blockNumber);
    }
  }

}

test();
