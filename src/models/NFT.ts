class NFT {
  nft_type: string
  tx_type: string
  block_number: number
  transaction_hash: string
  chain: string
  from: string
  to: string
  token_contract: number
  token_id: number
  token_value: string
  token_uri: string
  metadata: any

  constructor(nft: any) {
    this.nft_type = nft.nft_type
    this.tx_type = nft.tx_type
    this.block_number = nft.block_number
    this.transaction_hash = nft.transaction_hash
    this.chain = nft.chain
    this.from = nft.from
    this.to = nft.to
    this.token_contract = nft.token_contract
    this.token_id = nft.token_id
    this.token_value = nft.token_value
    this.token_uri = nft.token_uri ? nft.token_uri : null
    this.metadata = nft.metadata ? nft.metadata : null
  }

  toDict() {
    return {
      nft_type: this.nft_type,
      tx_type: this.tx_type,
      block_number: this.block_number,
      transaction_hash: this.transaction_hash,
      chain: this.chain,
      from: this.from,
      to: this.to,
      token_contract: this.token_contract,
      token_id: this.token_id,
      token_value: this.token_value,
      token_uri: this.token_uri,
      metadata: this.metadata
    }
  }
}
export default NFT
