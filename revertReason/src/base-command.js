const Web3 = require('web3')

class BaseCommand {
  constructor (web3) {
    this.web3 = web3
  }

  static fromTruffle (truffleConfig, commandArguments) {
    this.web3 = new Web3(truffleConfig.provider)
  }

  static getHelpText () {
    throw new Error('function getHelpText needs to be overwritten')
  }
}

module.exports = BaseCommand
