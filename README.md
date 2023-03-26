## On-chain-nft
Get on-chain NFT mints/transfers/burns including their metadata. Supported metadata formats:
- http/https
- IPFS
- Arweave
- Base64

## Dev
Clone the repo
```
git clone git@github.com:mohammed-almujil/on-chain-nfts.git
cd on-chain-nfts
```
Install dependencies
```
npm install
npm install -g ts-node
```

### **Ethereum**

ETH NFTs
```
const onChainNFT = require('./index')

onChainNFT.setEthProvider(PROVIDER_URL);

//All NFTs
const all = await onChainNFT.getEthNFTs({ blockNumber: blockNumber });

//ERC-721 NFTs only
const erc721 = await onChainNFT.getERC721({ blockNumber: blockNumber });

//ERC-1155 only
const erc1155 = await onChainNFT.getERC1155({ blockNumber: blockNumber });

```

Optionally set IPFS hostnames. The code will try the hostnames one by one in case of failure. More here https://ipfs.github.io/public-gateway-checker/
```
onChainNFT.setIpfsHostnames(['gateway.pinata.cloud','cloudflare-ipfs.com']);
```

Optionally set Arweave hostnames. The code will try the hostnames one by one in case of failure.
```
onChainNFT.setArweaveHostnames(['arweave.net']);
```
### **Tests**

Run tests locally, make sure PROVIDER_URL ENV variable is set then run
```
ts-node test.ts
```