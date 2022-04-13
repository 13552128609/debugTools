const abi = require('ethereumjs-abi')
const chalk = require('chalk')
const util = require('ethereumjs-util')

const BaseCommand = require('../base-command')
const { getRawTransactionReceipt } = require('../raw-requests')

class RevertReason extends BaseCommand {
  constructor (web3, host, transactionHash) {
    super(web3)

    this.host = host
    this.transactionHash = transactionHash
  }

  static fromTruffle (config, commandArguments) {
    super.fromTruffle(config, commandArguments)

    const network = config.networks[config.network]

    if (!Object.keys(network).includes('host')) {
      throw new Error(`Network ${config.network} does not have a 'host' value`)
    }

    return new RevertReason(this.web3, network.host, commandArguments[0])
  }

  static getHelpText () {
    return '<transactionHash>  Get the revert reason of a failed transaction'
  }

  isValidTransactionHash (transactionHash) {
    return /^0x([A-Fa-f0-9]{64})$/.test(transactionHash)
  }

  async checkTransactionStatus (transactionReceipt) {
    if (transactionReceipt.result === null) {
      throw new Error('Transaction does not exist in this network')
    }

    if (transactionReceipt.result.status !== '0x0') {
      throw new Error('The transaction did not revert, it finished successfully.')
    }
  }

  async getRevertReason (transactionReceipt) {
    // the raw revert reason consists of the function selector, and the encoded string with the message
    const encodedRevertReasonWithFunctionSelector = await this.getRawRevertReason(transactionReceipt)

    const encodedRevertReason = util.toBuffer(encodedRevertReasonWithFunctionSelector).slice(4)

    // the decoding function returns an array because it can be used to decode several values at once
    const revertReason = abi.rawDecode(['string'], encodedRevertReason)

    if (revertReason.length !== 1) {
      throw new Error('Could not decode the received result')
    }

    // in this case there is only one decoded value, which is the revert reason
    return revertReason[0].length > 0 ? chalk.green.bold(revertReason[0]) : chalk.yellow.bold('Could not retrieve revert reason in this network')
  }

  async getRawRevertReason (transactionReceipt) {
    // some clients, like Besu, return the revert reason directly in the receipt
    if ('revertReason' in transactionReceipt.result) {
      return transactionReceipt.result.revertReason
    }

    // for all other we need to replay the transaction to get it
    return this.getRawRevertReasonByReplayingTransaction(transactionReceipt)
  }

  async getRawRevertReasonByReplayingTransaction (transactionReceipt) {
    const transaction = await this.web3.eth.getTransaction(transactionReceipt.result.transactionHash)

    const transactionObject = {
      from: transaction.from,
      to: transaction.to,
      value: transaction.value,
      gas: transaction.gas,
      gasPrice: transaction.gasPrice,
      data: transaction.input
    }

    return this.web3.eth.call(transactionObject, transaction.blockNumber)
  }

  async execute () {
    if (!this.isValidTransactionHash(this.transactionHash)) {
      throw new Error(`TransactionHash ${this.transactionHash} is not valid`)
    }

    const transactionReceipt = await getRawTransactionReceipt(
      this.host,
      this.transactionHash
    )

    // await this.checkTransactionStatus(transactionReceipt)

    return this.getRevertReason(transactionReceipt)
  }
}

module.exports = RevertReason
