var Web3 = require('web3')

const web3 = new Web3('http://localhost:8545')
// web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));
// new Web3.providers.WebsocketProvider("ws://localhost:8545")

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
 * Might want to turn the logic into some sort of state machine
 * Would allow us to pick up from where we left off reading blocks
 */

async function getBlockInfo(blockNum) {
  var info = await web3.eth.getBlock(blockNum)
  return info
}

async function getTxReceipt(transaction) {
  var receipt = await web3.eth.getTransactionReceipt(transaction)
  return receipt
}

async function getTransactionCount(blockNum) {
  var count = await web3.eth.getBlockTransactionCount(blockNum)
  return count
}

async function getEventFromLogs(receipt) {
  var eventString
  for (let i = 0; i < receipt.logs.length; i++) {
    eventString = receipt.logs[i].data
    console.log("Event String:", web3.utils.toAscii(eventString))
  }
}

async function extractEvents(startBlock, endBlock) {
  var blockInfo, transactionCount
  var transactions, transactionReceipt
  for (var i = startBlock; i <= endBlock; i++) {
    blockInfo = await getBlockInfo(i)
    transactions = blockInfo.transactions
    console.log("Block #", i, "transaction list:", transactions)

    // Sorry for nesting loops like this, there's no better way :(
    for (let tx of transactions) {
      console.log("Transaction:", tx)
      if (tx != undefined) {
        transactionReceipt = await getTxReceipt(tx)
        console.log("TxReceipt: ", transactionReceipt)
        getEventFromLogs(transactionReceipt)
      }
    }

    // console.log(blockInfo)
  }
}

// Block 39 Should have a meaningful Honk
extractEvents(35, 39)
