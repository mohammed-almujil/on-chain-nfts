## On-chain-nft
Get on-chain NFT mints/transfers/burns including their metadata. Supported metadata formats:
- http/https
- IPFS
- Arweave
- Base64

## Dev
Clone the repo
```
git clone git@github.com:mohammed-almujil/on-chain-nft.git
cd on-chain-nft
```
Install dependencies
```
npm install
npm install -g ts-node
```
Set ETH provider URL in test.ts
```
onChainNFT.setEthProvider(PROVIDER_URL);
```
Optionally set IPFS hostnames. The code will try the hostnames one by one in case of failure. More here https://ipfs.github.io/public-gateway-checker/
```
onChainNFT.setIpfsHostnames(['gateway.pinata.cloud','cloudflare-ipfs.com']);
```

Optionally set Arweave hostnames. The code will try the hostnames one by one in case of failure.
```
onChainNFT.setIpfsHostnames(['gateway.pinata.cloud','cloudflare-ipfs.com']);
```

Run tests locally 
```
ts-node test.ts
```