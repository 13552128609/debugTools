"use strict"

let mod = '';
let network = 'main';
let groupId = '';

const usage = "Usage: node start.js <module: 'gpk' or 'incentive'> <network: 'main' or 'test'> <groupId: hex>";

if (process.argv.length > 4) {
  mod = process.argv[2];
  network = process.argv[3];
  groupId = process.argv[4];
  if ((!['gpk', 'incentive'].includes(mod)) || (!['main', 'test'].includes(network)) || (groupId.length != 66)) {
    console.log(usage);
    process.exit(1);
  }
} else {
  console.log(usage);
  process.exit(1);
}

global.network = network;

const gpk = require('./src/gpk');
const incentive = require('./src/incentive');

main();

function main() {
  if (mod == 'gpk') {
    gpk.run(groupId);
  } else if (mod == 'incentive') {
    incentive.run(groupId);
  } else {
    console.log("not suppot module %s", mod);
  }
}