const Discord = require('C:\\snapshot\\TorchJs\\Modules\\discord.js')

let Crashes = []

module.exports = (log) => {

    if (log !== 'Initializer: Keen broke the minidump, sorry.') return

    Crashes.push(new Date())

    console.log(Crashes)

}