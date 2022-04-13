# truffle-troubleshoot

[![npm](https://img.shields.io/npm/v/truffle-troubleshoot.svg)](https://www.npmjs.com/package/truffle-troubleshoot)

This [Truffle](https://www.trufflesuite.com/docs/truffle/overview) plugin helps you troubleshoot problems during interaction with your smart contracts.

## Installation

(1) Install the plugin with npm
```sh
npm install truffle-troubleshoot
```

(2) Add the plugin to your `truffle.js` or `truffle-config.js` file
```js
module.exports = {
  /* ... rest of truffle-config */

  plugins: [
    'truffle-troubleshoot'
  ]
}
```

## Usages

The plugin consists of several commands, which are listed below:

### revert-reason

This command prints the revert reason of a failed transaction. It requires the transaction hash as single argument.

```bash
truffle run troubleshoot revert-reason 0x1234....
```
