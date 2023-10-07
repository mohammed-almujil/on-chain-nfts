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

### **Tests**

Make sure PROVIDER_URL env variable is set. In the terminal run:

```
export PROVIDER_URL=wss://mainnet.infura.io/ws/v3/{key}
```
Then run tests:
```
npm run test
```

### **NPM publishing**

Build
```
npm run build
```
Publish the package to the npm registry. Only the files in the `dist` folder will be pushed
```
npm publish
```
