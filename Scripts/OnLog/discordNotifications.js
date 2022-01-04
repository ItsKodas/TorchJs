const Discord = require('C:\\snapshot\\TorchJs\\Modules\\discord.js')

module.exports = (data) => {
    if (data.includes('Chat:')) return

    if (data.includes('MultiplayerManagerBase: Player') && data.includes('joined')) Discord.Notification(`🤝 ${data.split('Player ')[1].split(' joined')[0]} has Joined ${process.env.name}`, '#b8ffa8')
    if (data.includes('Keen: User left')) {
        if (data.includes('User left [') && data.includes(']') && data.includes('...')) return
        Discord.Notification(`👋 ${data.split('User left ')[1].split('\n')[0].slice(0, -1)} has left ${process.env.name}`, '#ff887d')
    }
}