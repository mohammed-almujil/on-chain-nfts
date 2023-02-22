const onChainNFT = require('./index')

async function test() {

    onChainNFT.setEthProvider(process.env.PROVIDER_URL);


    console.log('# Testing get latest ERC721 with 100 block confirmations')
    const defaultOption = await onChainNFT.getERC721({
        blockNumber: 'latest'
    })
    console.log(JSON.stringify(defaultOption));
    console.log('found ' + defaultOption.length + ' NFTs using the latest block option');

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('-------------------------------------------');
    console.log('# Testing get NFTs by block number')
    let blockNumber = 16682812
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
}


test();
