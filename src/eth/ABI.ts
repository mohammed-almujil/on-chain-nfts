import { type AbiItem } from 'web3-utils'
const ERC721Transfer = [
  { type: 'address', name: 'from', indexed: true },
  { type: 'address', name: 'to', indexed: true },
  { type: 'uint256', name: 'tokenId', indexed: true }
]
const ERC721: AbiItem[] = [
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]
const ERC1155TransferSingle = [
  { type: 'address', name: 'operator', indexed: true },
  { type: 'address', name: 'from', indexed: true },
  { type: 'address', name: 'to', indexed: true },
  { type: 'uint256', name: 'id' },
  { type: 'uint256', name: 'value' }
]

const ERC1155TransferMulti = [
  { type: 'address', name: 'operator', indexed: true },
  { type: 'address', name: 'from', indexed: true },
  { type: 'address', name: 'to', indexed: true },
  { type: 'uint256[]', name: 'ids' },
  { type: 'uint256[]', name: 'values' }
]

const ERC1155: AbiItem[] = [
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'uri',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256"
      }
    ],
    name: "URI",
    type: "event"
  }
]
export { ERC721Transfer, ERC721, ERC1155TransferSingle, ERC1155TransferMulti, ERC1155, }
