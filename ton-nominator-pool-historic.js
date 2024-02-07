const { TonClient4, Address, fromNano } = require("ton")

const NominatorPoolAddress = 'Ef94U_9atKuZ2m98i578qrDaEc0-uUFNqVStvQs_Pwq9RDs7';
const DateSnapshot = '2023.12.31';

const clientV4 = new TonClient4({ endpoint: 'https://mainnet-v4.tonhubapi.com' });

async function main() {
    await stakeAtDay(NominatorPoolAddress, DateSnapshot);
    await latestStake(NominatorPoolAddress);
}

async function stakeAtDay(address, yyyy_mm_dd) {
    const epoch = Math.floor(new Date(DateSnapshot).getTime() / 1000);
    const blockNumber = (await clientV4.getBlockByUtime(epoch)).shards[0].seqno;
    console.log('Stake at:', yyyy_mm_dd, ' block:', blockNumber);
    await stake(address, blockNumber);
}

async function latestStake(address) {
    const latestBlock = (await clientV4.getLastBlock()).last.seqno;
    console.log('Latest stake;', ' block:', latestBlock);
    await stake(address, latestBlock);
}

async function stake(address, blockNumber) {
    let res = await clientV4.runMethod(blockNumber, Address.parse(address), 'list_nominators');
    let resPoolData = await clientV4.runMethod(blockNumber, Address.parse(address), 'get_pool_data');

    const nominatorStake = fromNano(res.result[0].items[0].items[1].value)
    const validatorAmount = fromNano(resPoolData.result[3].value)

    console.log('Nominator stake:', nominatorStake, 'TON');
    console.log('Validator amount:', validatorAmount, 'TON');
    console.log('Total:', parseFloat(nominatorStake) + parseFloat(validatorAmount), 'TON');
    console.log('-----------')
}

main();