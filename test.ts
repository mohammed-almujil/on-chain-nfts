const onChainNFT = require('./index')

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
        'dweb.link',
    ]);
    onChainNFT.setArweaveHostnames([
        'arweave.net',
    ]);

    console.log('# Testing get latest ERC721 with 100 block confirmations')
    const defaultOption = await onChainNFT.getERC721({
        blockNumber: 'latest'
    })
    console.log(JSON.stringify(defaultOption));
    console.log('found ' + defaultOption.length + ' NFTs using the latest block option');

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('-------------------------------------------');
    console.log('# Testing get NFTs by block number')
    let blockNumber = 16725346
    let blockNumberOption = await onChainNFT.getERC721({ blockNumber: blockNumber })
    console.log(JSON.stringify(blockNumberOption));
    console.log('found ' + blockNumberOption.length + ' NFTs in block ' + blockNumber);

    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('-------------------------------------------');
    console.log('# Testing get NFTs with TXs that include no tokenURI')
    blockNumber = 16633190
    blockNumberOption = await onChainNFT.getERC721({ blockNumber: blockNumber })
    console.log(JSON.stringify(blockNumberOption));
    console.log('found ' + blockNumberOption.length + ' NFTs in block ' + blockNumber);

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('-------------------------------------------');
    console.log('# Testing get NFTs with TX that has token burn')
    blockNumber = 16640530
    blockNumberOption = await onChainNFT.getERC721({ blockNumber: blockNumber })
    console.log(JSON.stringify(blockNumberOption));
    console.log('found ' + blockNumberOption.length + ' NFTs in block ' + blockNumber);

    console.log('-------------------------------------------');
    console.log('# Testing blocks with over 300 base64 tokenURIs')
    blockNumber = 16740129
    blockNumberOption = await onChainNFT.getERC721({ blockNumber: blockNumber })
    console.log(JSON.stringify(blockNumberOption));
    console.log('found ' + blockNumberOption.length + ' NFTs in block ' + blockNumber);

    
    // TO-DO
    // TEST blocks with IPFS, Arweave and base64/ 
    // test Set hostname with one hostname for both IPFS and arweave
}


test();

