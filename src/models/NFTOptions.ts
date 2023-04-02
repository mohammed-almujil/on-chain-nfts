class NFTOptions {
  blockNumber: string | number

  constructor (NFTOptions: any) {
    this.blockNumber = NFTOptions.blockNumber
      ? NFTOptions.blockNumber
      : 'latest'
  }

  toDict () {
    return {
      blockNumber: this.blockNumber
    }
  }
}
export default NFTOptions
