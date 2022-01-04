//? Shameless Promotion ;)
console.log('Check out the creator at https://discord.gg/horizons or https://www.horizons.gg')

const Editor = require('./Modules/editor.js')
const Discord = require('./Modules/discord.js')


//!
//! Prep Script
//!

var Torch, manualStop, delay, notification_channel, command_channel = false

const fs = require('fs')

const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()
const xmlBuilder = new xml2js.Builder()

const { Client, Intents } = require('discord.js')
var selectedIntents = []
for (intent in Intents.FLAGS) { selectedIntents.push(Intents.FLAGS[intent]) }
const client = new Client({ intents: selectedIntents })


var temp = {}
process.argv.splice(0, 2)
process.argv.forEach(arg => {
    if (!arg.includes('=')) return
    var split = arg.split('=')
    temp[split[0]] = split[1]
})


var config = {}
if (!fs.existsSync('config.json') && !config.config) {
    return fs.writeFileSync('config.json', JSON.stringify({
        "name": "Lobby",
        "servername": "My Awesome Server!",
        "worldname": "My Awesome World!",
        "dir": "path/to/server",
        "world": "MyWorldSave",
        "instance": "Instance",
        "sandbox": "Example/sandbox.cfg",
        "webhook": "http://myurl.com",
        "mods": ["Example/mods1.pack", "Example/mods2.pack"],
        "plugins": ["Example/plugins1.pack", "Example/plugins2.pack"],
        "discord": {
            "token": "",
            "prefix": "!",
            "admin_roles": ["roleid1", "roleid2"],
            "notification_channel": "",
            "command_channel": ""
        },
        "scripts": {
            "path": "./path/to/scripts",
            "OnPrep": [],
            "OnStart": [],
            "OnStop": [],
            "OnLog": [],
            "OnCommand": []
        }
    }, null, '\t'))
}
if (temp.config) config = JSON.parse(fs.readFileSync(temp.config, 'utf8'))
else (config = JSON.parse(fs.readFileSync('config.json', 'utf8'))), console.log('No config file specified, using default.')
for (arg in temp) config[arg] = temp[arg]

if (config.delay) delay = parseInt(config.delay) * 1000

if (!config.instance) config.instance = 'Instance'

if (config.discord.token) {
    client.login(config.discord.token)
    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`)
        if (config.discord.notification_channel) notification_channel = await client.channels.fetch(config.discord.notification_channel), process.notification_channel = notification_channel
        if (config.discord.command_channel) command_channel = await client.channels.fetch(config.discord.command_channel), process.command_channel = command_channel
        setTimeout(StartProcess, delay || 500)
    })
} else setTimeout(StartProcess, delay || 500)

if (config.scripts) if (config.scripts.path) {
    if (!fs.existsSync(`${config.scripts.path}/OnPrep`)) fs.mkdirSync(`${config.scripts.path}/OnPrep`)
    if (!fs.existsSync(`${config.scripts.path}/OnStart`)) fs.mkdirSync(`${config.scripts.path}/OnStart`)
    if (!fs.existsSync(`${config.scripts.path}/OnStop`)) fs.mkdirSync(`${config.scripts.path}/OnStop`)
    if (!fs.existsSync(`${config.scripts.path}/OnLog`)) fs.mkdirSync(`${config.scripts.path}/OnLog`)
    if (!fs.existsSync(`${config.scripts.path}/OnCommand`)) fs.mkdirSync(`${config.scripts.path}/OnCommand`)
}

process.env = config

config.scripts.OnPrep.forEach(script => {
    require(`${config.scripts.path}/OnPrep/${script}.js`)
    console.log(`OnPrep - ${script}`)
})



//!
//! Prep Files
//!

async function FilePrep() {

    //? TorchCFG
    var TorchCFG = await Editor.GetTorchCFG()

    TorchCFG.TorchConfig.InstanceName[0] = config.name || TorchCFG.TorchConfig.InstanceName[0]
    TorchCFG.TorchConfig.Autostart[0] = 'true'
    TorchCFG.TorchConfig.RestartOnCrash[0] = 'false'
    TorchCFG.TorchConfig.NoGui[0] = 'true'
    TorchCFG.TorchConfig.InstancePath[0] = `${config.dir}\\${config.instance}`

    if (config.plugins) {
        var Plugins = []
        for (pack of config.plugins) {
            await Editor.ParseXML(pack).then(result => result.Plugins.guid.forEach(guid => { if (!Plugins.includes(guid)) Plugins.push(guid) }))
        }
        TorchCFG.TorchConfig.Plugins = { guid: Plugins }
    }

    Editor.UpdateTorchCFG(TorchCFG), console.log('Torch Config Updated!')


    //? Logging
    var NLog = await Editor.ParseXML(`${config.dir}/NLog.config`)
    var NLogUser = await Editor.ParseXML(`${config.dir}/NLog-user.config`)

    NLog.nlog.targets[0].target[1].$.fileName = "Logs\\" + config.name + "\\Keen-${shortdate}.log"
    NLog.nlog.targets[0].target[2].$.fileName = "Logs\\" + config.name + "\\Torch-${shortdate}.log"
    NLog.nlog.targets[0].target[3].$.fileName = "Logs\\" + config.name + "\\Chat.log"
    NLog.nlog.targets[0].target[5].$.fileName = "Logs\\" + config.name + "\\patch.log"

    NLogUser.nlog.targets[0].target[1].$.fileName = "Logs\\" + config.name + "\\Keen-${shortdate}.log"
    NLogUser.nlog.targets[0].target[2].$.fileName = "Logs\\" + config.name + "\\Torch-${shortdate}.log"
    NLogUser.nlog.targets[0].target[3].$.fileName = "Logs\\" + config.name + "\\Chat.log"
    NLogUser.nlog.targets[0].target[5].$.fileName = "Logs\\" + config.name + "\\patch.log"

    fs.writeFileSync(`${config.dir}/NLog.config`, Editor.BuildXML(NLog)), console.log('NLog Config Updated!')
    fs.writeFileSync(`${config.dir}/NLog-user.config`, Editor.BuildXML(NLogUser)), console.log('NLog-user Config Updated!')


    //? SEDedicated
    if (config.sandbox && config.world) {
        var SEDTemplate = await Editor.ParseXML(config.sandbox)
        var SEDLive = await Editor.GetSEDConfig()
        var Sandbox = await Editor.GetSandboxSBC()
        var SandboxConfig = await Editor.GetSandboxConfig()

        SEDLive.MyConfigDedicated.SessionSettings[0] = SEDTemplate.MyConfigDedicated.SessionSettings[0]
        SEDLive.MyConfigDedicated.Administrators[0] = SEDTemplate.MyConfigDedicated.Administrators[0]
        SEDLive.MyConfigDedicated.AutoUpdateEnabled[0] = 'true'
        SEDLive.MyConfigDedicated.LoadWorld[0] = `${config.dir}/${config.instance}/Saves/${config.world}`
        if (config.port) SEDLive.MyConfigDedicated.ServerPort[0] = config.port
        if (config.servername) SEDLive.MyConfigDedicated.ServerName[0] = config.servername
        if (config.worldname) SEDLive.MyConfigDedicated.WorldName[0] = config.worldname


        if (config.servername) Sandbox.MyObjectBuilder_Checkpoint.SessionName[0] = config.worldname
        Sandbox.MyObjectBuilder_Checkpoint.Settings = SEDTemplate.MyConfigDedicated.SessionSettings[0]


        if (config.servername) SandboxConfig.MyObjectBuilder_WorldConfiguration.SessionName[0] = config.worldname
        SandboxConfig.MyObjectBuilder_WorldConfiguration.Settings = SEDTemplate.MyConfigDedicated.SessionSettings[0]


        if (config.mods) {
            var Mods = []
            var Ids = []
            for (pack of config.mods) {
                await Editor.ParseXML(pack).then(result => result.Mods.ModItem.forEach(mod => { if (!Ids.includes(mod.PublishedFileId)) Mods.push(mod), Ids.push(mod.PublishedFileId) }))
            }
            Sandbox.MyObjectBuilder_Checkpoint.Mods = { ModItem: Mods }
            SandboxConfig.MyObjectBuilder_WorldConfiguration.Mods = { ModItem: Mods }
        }


        Editor.UpdateSEDConfig(SEDLive), console.log('SpaceEngineers-Dedicated Config Updated!')
        Editor.UpdateSandboxSBC(Sandbox), console.log('Sandbox Updated!')
        Editor.UpdateSandboxConfig(SandboxConfig), console.log('Sandbox Config Updated!')
    }

}



//!
//! Process Functions
//!

const spawn = require('child_process').spawn

async function StartProcess() {

    if (Torch) Torch.kill(), Torch = undefined

    if (fs.existsSync(`${config.dir}/BUSY`)) {
        var Busy = fs.readFileSync(`${config.dir}/BUSY`, 'utf8')
        var BusyTime = new Date(Busy)
        var CurrentTime = new Date()

        console.log(CurrentTime - BusyTime)

        if (CurrentTime - BusyTime > 1000 * 60) console.log('Busy time is outdated, terminating busy protocol.'), fs.unlinkSync(`${config.dir}/BUSY`)
        else return console.log('Another Torch Instance is Currently Preparing, trying again in 10 seconds...\n', Busy), setTimeout(StartProcess, 1000 * 10)
    }

    fs.writeFileSync(`${config.dir}/BUSY`, Date().toLocaleUpperCase(), 'utf8')

    console.log('Preparing Files...')
    await FilePrep(), console.log('Files Ready!')

    config.scripts.OnStart.forEach(script => {
        require(`${config.scripts.path}/OnStart/${script}.js`)
        console.log(`OnStart - ${script}`)
    })

    console.log('Launching Instance...'), Discord.Notification(`⏳ ${config.name} is Starting...`, '#0fc1f2')
    Torch = spawn(`${config.dir}\\Torch.Server.exe`)

    Torch.stdout.on('data', async data => {
        data = data.toString('utf8')
        console.log(data)

        config.scripts.OnLog.forEach(script => {
            require(`${config.scripts.path}/OnLog/${script}.js`)(data)
        })

        if (data.includes('Chat:')) return


        if (data.includes('Game ready')) Discord.Notification(`✅ ${config.name} is Ready to Join!`, '#33d438')

        if (data.includes('Server stopped.')) {
            Discord.Notification(`⛔ ${config.name} has Stopped`, '#d43333')
            Torch.kill(), setTimeout(StartProcess, delay || 500)
            config.scripts.OnStop.forEach(script => {
                require(`${config.scripts.path}/OnStop/${script}.js`)(msg, client)
                console.log(`OnStop - ${script}`)
            })
        }

        if (data.includes('Generating minidump at')) {
            Discord.Notification(`❌ ${config.name} has Crashed!`, '#d43333')
            Torch.kill(), setTimeout(StartProcess, 8000)
            config.scripts.OnStop.forEach(script => {
                require(`${config.scripts.path}/OnStop/${script}.js`)(msg, client)
                console.log(`OnStop - ${script}`)
            })
        }

        if (data.includes('Torch: Initializing server')) fs.unlinkSync(`${config.dir}/BUSY`)
    })
}

function Stop() {
    manualStop = true
    if (Torch) Torch.kill(), Torch = undefined
    Discord.Notification(`⛔ ${config.name} has been Stopped`, '#d43333')
}

function Start() {
    manualStop = false
    setTimeout(StartProcess, delay || 500)
}



//!
//! Discord Functions
//!

client.on('messageCreate', msg => {
    if (msg.author.bot) return
    if (msg.channel.id != command_channel.id) return

    config.scripts.OnCommand.forEach(script => {
        require(`${config.scripts.path}/OnCommand/${script}.js`)(msg, client)
        console.log(`OnCommand - ${script}`)
    })


    var args = msg.content.toLowerCase().trim().split(' ')
    if (args[0].charAt(0) !== config.discord.prefix || args[1] !== config.name.toLowerCase()) return
    args[0] = args[0].substring(1)

    var guild = client.guilds.cache.get(msg.guild.id)
    var member = guild.members.cache.get(msg.author.id)

    var isAdmin = false
    for (role of config.discord.admin_roles) {
        if (member._roles.includes(role)) isAdmin = true
    }
    if (!isAdmin) return


    if (args[0] === 'stop') {
        if (!Torch) return msg.reply(`${config.name} is already stopped!`)
        Stop()
        msg.reply(`${config.name} has been killed!`)
        Discord.Notification(`🔧 ${config.name} has been stopped by a Staff Member.`, '#a13ffc')

        Torch = undefined
    }

    if (args[0] === 'start') {
        if (Torch) return msg.reply(`${config.name} is already running!`)
        Start()
        msg.reply(`${config.name} is starting...`)
    }

    if (args[0] === 'restart') {
        manualStop = true
        Stop(), setTimeout(() => { Start() }, 10 * 1000)
        msg.reply(`Restart Initiated for ${config.name}.`)
        Discord.Notification(`🔧 ${config.name} has been restarted by a Staff Member.`, '#a13ffc')
    }
})



function Loop() {
    var temp = JSON.parse(fs.readFileSync(config.config, 'utf8'))
    config.scripts = temp.scripts
    process.env.scripts = temp.scripts
} setInterval(Loop, 1000 * 30)



module.exports = {
    Start,
    Stop
}