const Server = require('C:\\snapshot\\TorchJs\\main.js')
const Discord = require('C:\\snapshot\\TorchJs\\Modules\\discord.js')

module.exports = async (msg) => {

    if (msg.channel.id != process.env.discord.command_channel.id) return

    var auth = `${process.env.discord.prefix}mass reboot [confirm]`

    if (msg.content !== auth.toLowerCase()) return
    if (msg.author.id !== "240786290600181761") return msg.reply('You do not have access to this command!')

    Discord.Notification(`♻️ Mass Reboot - ${process.env.name}, please standby.`)

    Server.Stop()
    setTimeout(() => { Server.Start() }, 2000)

    msg.react('👍')
}