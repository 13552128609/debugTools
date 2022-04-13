const axios = require('axios')

async function getRawTransactionReceipt (providerURL, transactionHash) {
  let transactionReceiptResponse

  try {
    transactionReceiptResponse = await axios.post(
      providerURL,
      {
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [transactionHash],
        id: 1
      }
    )
  } catch (error) {
    throw new Error(`Cannot get transaction receipt: ${error}`)
  }

  return transactionReceiptResponse.data
}

module.exports = {
  getRawTransactionReceipt
}
