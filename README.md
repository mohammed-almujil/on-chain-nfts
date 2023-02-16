## On-chain-nft
Get on-chain NFT mints/transfer on the ETH blockchains

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
Set the ETH provider URL in test.ts
```
onChainNFT.setEthProvider(PROVIDER_URL)
```

Run tests locally 
```
ts-node test.ts
```