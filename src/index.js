var Web3 = require('web3')

const web3 = new Web3('http://localhost:8545')

console.log("Running Web3 Version: ", web3.version)

/*
 *  Application Flow
 *
 *  Make historical pass
 *  - Walk though blocks, iterating through Tx's and
 *  extracting events
 *  - Store events against their contract
 *    - Also want timestamp, block number
 *
 *  Check if DB has events up to date
 *  If not, make 'historical' like pass from last known event
 *
 *  Once events are up-to-date, subscibe for new events
 *  Keep storing new events in DB until AWS gets angry
 *
 */

async function getBlockInfo(blockNum) {
  var res = await web3.eth.getBlock(blockNum)
  return res
}

getBlockInfo(14).then(res => {
  var blockTxs = res.transactions
  console.log(res)
  console.log(blockTxs)
})

web3.eth.getBlockTransactionCount(1).then(count => {
  console.log("Count: ", count)
})
