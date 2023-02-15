import { AbiItem } from 'web3-utils'


const ERC721Transfer = [{
    type: 'address',
    name: 'from',
    indexed: true,
}, {
    type: 'address',
    name: 'to',
    indexed: true,
}, {
    type: 'uint256',
    name: 'tokenId',
    indexed: true,
},
];

const ERC721TokenURI: AbiItem= 
{
    inputs: [
        {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256'
        }
    ],
    name: 'tokenURI',
    outputs: [
        {
            internalType: 'string',
            name: '',
            type: 'string'
        }
    ],
    stateMutability: 'view',
    type: 'function'
};

const ERC721: AbiItem[]= [
    {
      "constant": true,
      "inputs": [
        {
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
    }]
  ;

export { ERC721TokenURI, ERC721Transfer, ERC721 };
