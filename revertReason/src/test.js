const RevertReason = require('./commands/revert-reason');
const Web3 = require('web3');
const web3Int = new Web3(new Web3.providers.HttpProvider("http://192.168.1.179:18545"));
const web3Test = new Web3(new Web3.providers.HttpProvider("https://gwan-ssl.wandevs.org:46891"));

const optimist = require('optimist');
   let argv = optimist
        .usage("Usage: $0")
        .alias('h', 'help')
        .describe('tx', 'txHash')
        .string('tx')
        .argv;

  if(parseInt(Object.getOwnPropertyNames(optimist.argv).length) <= 2){
      optimist.showHelp();
      process.exit(0);
 }


console.log(argv);
let revert1 = new RevertReason(
  web3Test, 
  "https://gwan-ssl.wandevs.org:46891", 
  argv["tx"]);
revert1.execute().then(console.log).catch(console.log);
//revert1.execute().then(console.log)
