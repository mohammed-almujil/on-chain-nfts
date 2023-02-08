class Logs {

        address: string;
        data: string;
        topics: string[];
        logIndex: number;
        transactionIndex: number;
        transactionHash: string;
        blockHash: string;
        blockNumber: number;
        removed: boolean;

    constructor(nft: any) {
        this.address = nft.address;
        this.data = nft.data;
        this.topics = nft.topics;
        this.logIndex = nft.logIndex;
        this.transactionIndex = nft.transactionIndex;
        this.transactionHash = nft.transactionHash;
        this.blockHash = nft.blockHash;
        this.blockNumber = nft.blockNumber;
        this.removed = nft.removed;

    }

}
export default Logs;
