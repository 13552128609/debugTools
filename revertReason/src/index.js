const chalk = require('chalk')

const COMMANDS = {
  'revert-reason': require('./commands/revert-reason')
}

let exitCallBack
let helpText

function exitWithError (message) {
  exitCallBack(chalk.bold.red(message))
}

function constructHelpText () {
  helpText = '\nUsage: truffle run troubleshoot [options] <command> [commandArguments...] \n\n' +
             'A Truffle plugin to troubleshoot your smart contract problems\n\n' +
             // 'Options:\n' +
             // '  -v, --version                    output the version number\n' +
             '  -h, --help                       Prints this help information\n\n' +
             'Commands:\n'

  for (const [commandName, commandObject] of Object.entries(COMMANDS)) {
    helpText += `  ${commandName} ${commandObject.getHelpText()}\n`
  }
}

module.exports = async (truffleConfig, done) => {
  exitCallBack = done

  if (truffleConfig.network === undefined) {
    truffleConfig.network = 'development'
  }

  constructHelpText()

  if (truffleConfig.help) {
    console.log(helpText)
    exitCallBack()
  }

  if (truffleConfig._.length === 1) {
    console.log(helpText)
    exitWithError('No command given')
  }

  const commandName = truffleConfig._[1]

  if (!(commandName in COMMANDS)) {
    exitWithError(`Unknown command ${commandName}`)
  }

  const command = COMMANDS[commandName].fromTruffle(
    truffleConfig,
    // process.argv is used here, because config._ seems to convert the arguments in unpredictable ways
    // e.g. a transaction hash is returned as Number object
    process.argv.splice(5)
  )

  try {
    const result = await command.execute()
    console.log(`\n${result}\n`)
  } catch (error) {
    exitWithError(error)
  }

  exitCallBack()
}
