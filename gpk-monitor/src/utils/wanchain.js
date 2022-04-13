const mainCfg = require('../../cfg/config-main');
const testCfg = require('../../cfg/config-test');
const abiMap = require('../../cfg/abi');
const Web3 = require('web3');

const CurveName = {
  0: 'secp256k1',
  1: 'bn256',
}

const SmgGroupStatus = {
  0: 'None',
  1: 'Initial',
  2: 'CurveSeted',
  3: 'Failed',
  4: 'Selected',
  5: 'Ready',
  6: 'Unregistered',
  7: 'Dismissed'
};

const GpkGroupStatus = {
  0: 'PolyCommit',
  1: 'Negotiate',
  2: 'Complete',
  3: 'Close'
};

const config = (global.network == 'main')? mainCfg : testCfg;
console.log("network: %s", global.network);

const web3 = new Web3(new Web3.providers.HttpProvider(config.wanNodeURL));

const gpkSc = getContract('gpk', config.contractAddress.gpk);
const smgSc = getContract('smg', config.contractAddress.smg);

function getContract(name, address) {
  let abi = abiMap.get(name);
  if (abi) {
    return new web3.eth.Contract(abi, address);
  } else {
    return null;
  }
}

async function getSmgGroupInfo(groupId) {
  let info = await smgSc.methods.getStoremanGroupInfo(groupId).call();
  return {
    status: SmgGroupStatus[info.status] + '(' + info.status + ')',
    startTime: new Date(info.startTime * 1000).toISOString(),
    endTime: new Date(info.endTime * 1000).toISOString(),
    curve1: CurveName[info.curve1],
    curve2: CurveName[info.curve2],
    gpk1: info.gpk1,
    gpk2: info.gpk2,    
  };  
}

async function getSmgSelectedSm(groupId) {
  let storemen = await smgSc.methods.getSelectedStoreman(groupId).call();
  return storemen;  
}

async function getSmgSmInfo(wkAddr) {
  let info = await smgSc.methods.getStoremanInfo(wkAddr).call();
  return {
    wkAddr,
    groupId: info.groupId,
    nextGroupId: info.nextGroupId,
    incentivedDay: new Date(info.incentivedDay * 86400 * 1000).toISOString()
  };
}

async function getGpkGroupInfo(groupId, round) {
  let info = await gpkSc.methods.getGroupInfo(groupId, round).call();
  return {
    round: info.queriedRound,
    // curve1: info.curve1,
    curve1Status: GpkGroupStatus[info.curve1Status],
    curve1StatusTime: new Date(info.curve1StatusTime * 1000).toISOString(),
    // curve2: info.curve2,
    curve2Status: GpkGroupStatus[info.curve2Status],
    curve2StatusTime: new Date(info.curve2StatusTime * 1000).toISOString()
  }
}

async function getPolyCommit(groupId, round, curve, smArray) {
  let result = [];
  await Promise.all(smArray.map(async (sm, i) => {
    let pc = await gpkSc.methods.getPolyCommit(groupId, round, curve, sm).call();
    result[i] = pc;
  }));
  return result;
}

async function getSijInfo(groupId, round, curve, smArray) {
  let result = [];
  for (let i in smArray) {
    let src = smArray[i];
    let inner = [];
    await Promise.all(smArray.map(async (dest, j) => {
      let info = await gpkSc.methods.getSijInfo(groupId, round, curve, src, dest).call();
      inner[j] = info;
    }));
    result[i] = inner;
  }
  return result;
}

module.exports = {
  getContract,
  getSmgGroupInfo,
  getSmgSelectedSm,
  getSmgSmInfo,
  getGpkGroupInfo,
  getPolyCommit,
  getSijInfo
}