//? Shameless Promotion ;)
console.log('Check out the creator at https://discord.gg/horizons or https://www.horizons.gg')

const World = require('./Modules/worldedit.js')
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

if (config.scripts.path) {
    if (!fs.existsSync(`${config.scripts.path}/OnPrep`)) fs.mkdirSync(`${config.scripts.path}/OnPrep`)
    if (!fs.existsSync(`${config.scripts.path}/OnStart`)) fs.mkdirSync(`${config.scripts.path}/OnStart`)
    if (!fs.existsSync(`${config.scripts.path}/OnStop`)) fs.mkdirSync(`${config.scripts.path}/OnStop`)
    if (!fs.existsSync(`${config.scripts.path}/OnLog`)) fs.mkdirSync(`${config.scripts.path}/OnLog`)
    if (!fs.existsSync(`${config.scripts.path}/OnCommand`)) fs.mkdirSync(`${config.scripts.path}/OnCommand`)
}

process.env = config

LoadScripts('OnPrep')



//!
//! Prep Files
//!

async function FilePrep() {

    //? TorchCFG
    var TorchCFG = await ParseXML(`${config.dir}/Torch.cfg`)

    TorchCFG.TorchConfig.InstanceName[0] = config.name || TorchCFG.TorchConfig.InstanceName[0]
    TorchCFG.TorchConfig.Autostart[0] = 'true'
    TorchCFG.TorchConfig.RestartOnCrash[0] = 'false'
    TorchCFG.TorchConfig.NoGui[0] = 'true'
    TorchCFG.TorchConfig.InstancePath[0] = `${config.dir}\\${config.instance}`

    if (config.plugins) {
        var Plugins = []
        for (pack of config.plugins) {
            await ParseXML(pack).then(result => result.Plugins.guid.forEach(guid => { if (!Plugins.includes(guid)) Plugins.push(guid) }))
        }
        TorchCFG.TorchConfig.Plugins = { guid: Plugins }
    }

    fs.writeFileSync(`${config.dir}/Torch.cfg`, BuildXML(TorchCFG)), console.log('Torch Config Updated!')


    //? Logging
    var NLog = await ParseXML(`${config.dir}/NLog.config`)
    var NLogUser = await ParseXML(`${config.dir}/NLog-user.config`)

    NLog.nlog.targets[0].target[1].$.fileName = "Logs\\" + config.name + "\\Keen-${shortdate}.log"
    NLog.nlog.targets[0].target[2].$.fileName = "Logs\\" + config.name + "\\Torch-${shortdate}.log"
    NLog.nlog.targets[0].target[3].$.fileName = "Logs\\" + config.name + "\\Chat.log"
    NLog.nlog.targets[0].target[5].$.fileName = "Logs\\" + config.name + "\\patch.log"

    NLogUser.nlog.targets[0].target[1].$.fileName = "Logs\\" + config.name + "\\Keen-${shortdate}.log"
    NLogUser.nlog.targets[0].target[2].$.fileName = "Logs\\" + config.name + "\\Torch-${shortdate}.log"
    NLogUser.nlog.targets[0].target[3].$.fileName = "Logs\\" + config.name + "\\Chat.log"
    NLogUser.nlog.targets[0].target[5].$.fileName = "Logs\\" + config.name + "\\patch.log"

    fs.writeFileSync(`${config.dir}/NLog.config`, BuildXML(NLog)), console.log('NLog Config Updated!')
    fs.writeFileSync(`${config.dir}/NLog-user.config`, BuildXML(NLogUser)), console.log('NLog-user Config Updated!')


    //? SEDedicated
    if (config.sandbox && config.world) {
        var SEDTemplate = await ParseXML(config.sandbox)
        var SEDLive = await ParseXML(`${config.dir}/${config.instance}/SpaceEngineers-Dedicated.cfg`)
        var Sandbox = await ParseXML(`${config.dir}/${config.instance}/Saves/${config.world}/Sandbox.sbc`)
        var SandboxConfig = await ParseXML(`${config.dir}/${config.instance}/Saves/${config.world}/Sandbox_config.sbc`)

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
                await ParseXML(pack).then(result => result.Mods.ModItem.forEach(mod => { if (!Ids.includes(mod.PublishedFileId)) Mods.push(mod), Ids.push(mod.PublishedFileId) }))
            }
            Sandbox.MyObjectBuilder_Checkpoint.Mods = { ModItem: Mods }
            SandboxConfig.MyObjectBuilder_WorldConfiguration.Mods = { ModItem: Mods }
        }


        fs.writeFileSync(`${config.dir}/${config.instance}/SpaceEngineers-Dedicated.cfg`, BuildXML(SEDLive)), console.log('SpaceEngineers-Dedicated Config Updated!')
        fs.writeFileSync(`${config.dir}/${config.instance}/Saves/${config.world}/Sandbox.sbc`, BuildXML(Sandbox)), console.log('Sandbox Updated!')
        fs.writeFileSync(`${config.dir}/${config.instance}/Saves/${config.world}/Sandbox_config.sbc`, BuildXML(SandboxConfig)), console.log('Sandbox Config Updated!')
    }

}



//!
//! Process Functions
//!

const spawn = require('child_process').spawn

async function StartProcess() {

    if (Torch) Torch.kill(), Torch = undefined

    console.log('Preparing Files...')
    await FilePrep(), console.log('Files Ready!')

    console.log('Loading Scripts...')
    await LoadScripts('OnStart')

    console.log('Launching Instance...'), Discord.Notification(`⏳ ${config.name} is Starting...`, '#0fc1f2')
    Torch = spawn(`${config.dir}\\Torch.Server.exe`)

    Torch.stdout.on('data', async data => {
        data = data.toString('utf8')
        console.log(data)

        if (data.includes('Chat:')) return

        if (data.includes('Game ready')) Discord.Notification(`✅ ${config.name} is Ready to Join!`, '#33d438')

        if (data.includes('Server stopped.')) {
            Torch.kill(), setTimeout(StartProcess, delay || 500)
            Discord.Notification(`⛔ ${config.name} has Stopped`, '#d43333')
            await LoadScripts('OnStop')
        }

        if (data.includes('Generating minidump at')) {
            Torch.kill(), setTimeout(StartProcess, 8000)
            Discord.Notification(`❌ ${config.name} has Crashed!`, '#d43333')
            await LoadScripts('OnStop')
        }

        if (data.includes('MultiplayerManagerBase: Player') && data.includes('joined')) {
            Discord.Notification(`🤝 ${data.split('Player ')[1].split(' joined')[0]} has Joined ${config.name}`, '#b8ffa8')
        }
        if (data.includes('Keen: User left')) {
            if (data.includes('User left [') && data.includes(']') && data.includes('...')) return
            Discord.Notification(`👋 ${data.split('User left ')[1].split('\n')[0].slice(0, -1)} has left ${config.name}`, '#ff887d')
        }
    })

    // Torch.on('close', () => {
    //     if (manualStop) return
    //     Discord.Notification(`❌ ${config.name} has Crashed!`, '#d43333')
    //     setTimeout(StartProcess, 8000)
    // })

    // Torch.on('error', () => {
    //     if (manualStop) return
    //     Discord.Notification(`❌ ${config.name} has Crashed!`, '#d43333')
    //     setTimeout(StartProcess, 8000)
    // })

}



//!
//! Scripts
//!

async function LoadScripts(type) {
    config.scripts[type].forEach(script => {
        require(`${config.scripts.path}/${type}/${script}`)(client)
        console.log(`${type} - ${script}`)
    })
}



//!
//! XML Functions
//!

function ParseXML(file) {
    return new Promise((resolve, reject) => {
        xmlParser.parseString(fs.readFileSync(file, 'utf8'), (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}

function BuildXML(obj) {
    return xmlBuilder.buildObject(obj)
}



//!
//! Discord Functions
//!

client.on('messageCreate', msg => {
    if (msg.author.bot) return
    if (msg.channel.id != command_channel.id) return

    config.scripts.OnCommand.forEach(script => {
        require(`${config.scripts.path}/OnCommand/${script}`)(msg, client)
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
        manualStop = true
        Torch.kill()
        msg.reply(`${config.name} has been killed!`)
        Discord.Notification(`🔧 ${config.name} has been stopped by a Staff Member.`, '#a13ffc')

        Torch = undefined
    }

    if (args[0] === 'start') {
        if (Torch) return msg.reply(`${config.name} is already running!`)
        manualStop = false
        StartProcess()
        msg.reply(`${config.name} is starting...`)
    }

    if (args[0] === 'restart') {
        manualStop = true
        Torch.kill(), setTimeout(() => { StartProcess(), manualStop = false }, 10 * 1000)
        msg.reply(`Restart Initiated for ${config.name}.`)
        Discord.Notification(`🔧 ${config.name} has been restarted by a Staff Member.`, '#a13ffc')
    }
})



//!
//! Webhook
//!

const fetch = require('node-fetch')
async function Webhook() {

    var Sandbox = await ParseXML(`${config.dir}/${config.instance}/Saves/${config.world}/Sandbox.sbc`)

    var data = {}

    try {
        for (Player of Sandbox.MyObjectBuilder_Checkpoint.AllPlayersData[0].dictionary[0].item) {
            if (Player.Value[0].Connected[0] === 'false' || !Player.Value[0].DisplayName[0]) continue
            data[Player.Value[0].IdentityId[0]] = {
                name: Player.Value[0].DisplayName[0],
                admin: Player.Value[0].PromoteLevel[0],
                creative: Player.Value[0].CreativeToolsEnabled[0],
                admin_settings: Player.Value[0].RemoteAdminSettings[0]
            }
        }
    } catch (err) { console.log(err) }

    fetch(config.webhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Sector': config.name
        },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.status !== 200) console.log(`Webhook response: ${res.status}`)
        })
        .catch(err => console.log(err))


}
if (config.webhook) setInterval(Webhook, 1000 * 60), Webhook()