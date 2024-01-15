const {TonClient4, Address, fromNano} = require("ton")

const NominatorPoolAddress = 'Ef-ow0xjskANzvDgPQ6ClnIwcBi4F3N3WPF_pLTvoTVS7In9';
const DateSnapshot = '2023.12.31';

async function main() {

    const clientV4 = new TonClient4({endpoint: 'https://mainnet-v4.tonhubapi.com'}); 
    const epoch = Math.floor(new Date(DateSnapshot).getTime() / 1000);
    const blockNumber = (await clientV4.getBlockByUtime(epoch)).shards[0].seqno;

    let res = await clientV4.runMethod(blockNumber, Address.parse(NominatorPoolAddress), 'list_nominators');

    console.log(fromNano(res.result[0].items[0].items[1].value));
}

main();