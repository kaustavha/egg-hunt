// config ES
var ES = require('elasticsearch');
var client = new ES.Client({
  host: 'localhost:9200',
  log: 'trace'
});

function pushToES(ele) {
  console.log(JSON.stringify(ele));
  client.create({
    index: "ENS",
    type: "ensBidRevealed",
    id: ele.blockHash,
    body: ele
  }, () => {
    console.log(i++);
  });
}

function test() {
  pushToES({"name": "fakeTX", event: "0xsha3"});
}

test();

