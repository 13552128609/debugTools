"use strict"

const wanchain = require('./utils/wanchain');

async function run(groupId) {
  console.log("\r\nStoreman Group Info=====================================================================================");
  let smgGroup = await wanchain.getSmgGroupInfo(groupId);
  console.log("%O", smgGroup);
  let storemen = await wanchain.getSmgSelectedSm(groupId);
  console.log("Today: %s", new Date().toISOString());
  console.log("=> Storemen Incentive Date");
  for (let i in storemen) {
    let info = await wanchain.getSmgSmInfo(storemen[i]);
    let groupAbbr = info.groupId.substr(0, 4) + '...' + info.groupId.substr(-4);
    console.log("node %d: %s, %s, %s", i, storemen[i], groupAbbr, info.incentivedDay);
  }
}

module.exports = {
  run
}
