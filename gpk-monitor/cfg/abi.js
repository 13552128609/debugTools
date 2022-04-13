const smgAbi = require('./abis/abi.StoremanGroupDelegate.json');
const gpkAbi = require('./abis/abi.GpkDelegate.json');

const abiMap = new Map([
    ["smg", smgAbi],
    ["gpk", gpkAbi]
]);

module.exports = abiMap;
