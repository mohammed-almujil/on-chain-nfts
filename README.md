Import library 

```
import * as onChainNFT  from 'on-chain-nfts'
```
# ETH
Set ETH provider
```
onChainNFT.setEthProvider(process.env.PROVIDER_URL);
```
Optionally set IPFS hostnames. More here https://ipfs.github.io/public-gateway-checker/
```
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
```
Optionally set Arweave hostnames
```
onChainNFT.setArweaveHostnames([
    'arweave.net'
  ]);
```
Get all NFTs
```
const result = await onChainNFT.getEthNFTs({ blockNumber: 17166445 });
```
Get ERC-721  only
```
const result = await onChainNFT.getERC721({ blockNumber: 17166445 });
```
GET ERC-1155 only
```
const result = await onChainNFT.getERC1155({ blockNumber: 17166445 });

```

Example results 
```
[
    {
        "nft_type": "ERC-721",
        "tx_type": "TRANSFER",
        "block_number": 17166445,
        "transaction_hash": "0x2a5a692383fbab5c43b70fe3ff501a80d7e0540b75d2f3d2c9de86ace8f57607",
        "chain": "Ethereum",
        "from": "0x3bEd6c7Ec492D0d57f68F8c402FB7e2DE51c1165",
        "to": "0x743776E5A345fE62d7D85282407c94E616A03176",
        "token_contract": "0x32973908FaeE0Bf825A343000fE412ebE56F802A",
        "token_id": "4555",
        "token_uri": "https://pixelmon.club/api/4555",
        "metadata": {
            "name": "Pixelmon #4555",
            "image_url": "https://pixelmon-training-rewards.s3-accelerate.amazonaws.com/0/Tatsumaki.jpg",
            "external_url": "https://pixelmon.club/",
            "reward_bitmask": 6,
            "attributes": [
                {
                    "trait_type": "Species",
                    "value": "Tatsumaki"
                },
                ...
            ],
            "animation_url": "https://pixelmon-training-rewards.s3-accelerate.amazonaws.com/6/Tatsumaki.mp4"
        }
    },
    {
        "nft_type": "ERC-1155",
        "tx_type": "TRANSFER",
        "block_number": 17166445,
        "transaction_hash": "0x2a5a692383fbab5c43b70fe3ff501a80d7e0540b75d2f3d2c9de86ace8f57607",
        "chain": "Ethereum",
        "from": "0x3bEd6c7Ec492D0d57f68F8c402FB7e2DE51c1165",
        "to": "0x000000000000000000000000000000000000dEaD",
        "token_contract": "0xADaE0Ddaf90170a44ADEbcFB8eeDE12041D13220",
        "token_id": "2",
        "token_value": "3",
        "token_uri": "https://pixelmon.club/api/serum/meta/2",
        "metadata": {
            "name": "Tube",
            "animation_url": "https://pixelmon.club/serum/tube.mp4",
            "image_url": "https://pixelmon.club/serum/tube.png",
            "attributes": [
                {
                    "trait_type": "Evolution Stage",
                    "value": "E2"
                },
                ...
            ]
        }
    }
]
```

