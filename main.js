//? Shameless Promotion ;)
console.log('Check out the creator at https://discord.gg/horizons or https://www.horizons.gg')

const Editor = require('./Modules/editor.js')
const Discord = require('./Modules/discord.js')
const Util = require('./Modules/util.js')



//!
//! Prep Script
//!

var Torch, manualStop, delay, notification_channel, command_channel = false

const fs = require('fs')

const xml2js = require('xml2js')

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
        },
        "outputGameLog": true
    }, null, '\t'))
}
if (temp.config) config = JSON.parse(fs.readFileSync(temp.config, 'utf8'))
else (config = JSON.parse(fs.readFileSync('config.json', 'utf8'))), console.log('No config file specified, using default.')
for (arg in temp) {
    if (arg === 'mods') {
        if (config.mods) config.mods = config.mods.concat(temp.mods.split(','))
        else config.mods = temp.mods
    }
    else config[arg] = temp[arg]
}

if (config.delay) delay = parseInt(config.delay) * 1000

if (!config.instance) config.instance = 'Instance'

if (config.discord.token) {
    client.login(config.discord.token)
    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`)
        if (config.discord.notification_channel) notification_channel = await client.channels.fetch(config.discord.notification_channel), process.notification_channel = notification_channel
        if (config.discord.command_channel) command_channel = await client.channels.fetch(config.discord.command_channel), process.command_channel = command_channel
        setTimeout(Start, 1000)

        process.Discord = client
    })
} else setTimeout(Start, 1000)

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
    var NLog = await Editor.ParseXML(`${config.dir}\\NLog.config`)
    var NLogUser = await Editor.ParseXML(`${config.dir}\\NLog-user.config`)

    NLog.nlog.targets[0].target[1].$.fileName = "Logs\\" + config.name + "\\Keen-${shortdate}.log"
    NLog.nlog.targets[0].target[2].$.fileName = "Logs\\" + config.name + "\\Torch-${shortdate}.log"
    NLog.nlog.targets[0].target[3].$.fileName = "Logs\\" + config.name + "\\Chat.log"
    NLog.nlog.targets[0].target[5].$.fileName = "Logs\\" + config.name + "\\patch.log"

    NLogUser.nlog.targets[0].target[1].$.fileName = "Logs\\" + config.name + "\\Keen-${shortdate}.log"
    NLogUser.nlog.targets[0].target[2].$.fileName = "Logs\\" + config.name + "\\Torch-${shortdate}.log"
    NLogUser.nlog.targets[0].target[3].$.fileName = "Logs\\" + config.name + "\\Chat.log"
    NLogUser.nlog.targets[0].target[5].$.fileName = "Logs\\" + config.name + "\\patch.log"

    fs.writeFileSync(`${config.dir}\\NLog.config`, Editor.BuildXML(NLog)), console.log('NLog Config Updated!')
    fs.writeFileSync(`${config.dir}\\NLog-user.config`, Editor.BuildXML(NLogUser)), console.log('NLog-user Config Updated!')


    //? SEDedicated
    if (config.sandbox && config.world) {
        let SEDTemplate = await Editor.ParseXML(config.sandbox).catch(err => console.log(err))
        let SEDLive = await Editor.GetSEDConfig()
        let Sandbox = await Editor.GetSandboxSBC()
        let SandboxConfig = await Editor.GetSandboxConfig()
        let SandboxSBS = await Editor.GetSandboxSBS()

        SEDLive.MyConfigDedicated.SessionSettings[0] = SEDTemplate.MyConfigDedicated.SessionSettings[0]
        SEDLive.MyConfigDedicated.Administrators[0] = SEDTemplate.MyConfigDedicated.Administrators[0]
        SEDLive.MyConfigDedicated.AutoUpdateEnabled[0] = 'true'
        SEDLive.MyConfigDedicated['LoadWorld'] = [`${config.dir}\\${config.instance}\\Saves\\${config.world}`]
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
        Editor.UpdateSandboxSBS(SandboxSBS), console.log('Sandbox SBS Updated!')
    }

}



//!
//! Process Functions
//!

var activeProcess
const spawn = require('child_process').spawn

async function StartProcess() {

    if (Torch) Torch.kill(), Torch = undefined

    //? Busy Protocol
    let isReady = false
    let BusyJson = undefined

    while (isReady === false) {

        //? Busy Template
        const BusyTemplate = JSON.stringify({
            timestamp: Date.now(),
            que: [config.port || config.name]
        })

        await fs.promises.readFile(`${config.dir}\\BUSY`, 'utf-8')
            .then(data => JSON.parse(data))
            .then(json => {
                if (new Date() - new Date(json.timestamp) > 1000 * 15) return fs.writeFileSync(`${config.dir}\\BUSY`, BusyTemplate)

                json.timestamp = new Date()

                if (!json.que.includes(config.port || config.name)) return json.que.push(config.port || config.name), fs.writeFileSync(`${config.dir}\\BUSY`, JSON.stringify(json))
                if (json.que[0] !== config.port && config.name) return console.log(`Que Position ${json.que.indexOf(config.port || config.name)}/${json.que.length - 1}`)

                BusyJson = json

                return isReady = true, console.log(`Que Position ${json.que.indexOf(config.port || config.name)}/${json.que.length - 1}`)
            })
            .catch(() => fs.writeFileSync(`${config.dir}\\BUSY`, BusyTemplate))
        await Util.timer(3000)
    }


    //? Guarantee Process Port is Available & kill any processes using that port
    var PortCheck = await spawn('powershell', [`$proc = Get-Process -Id (Get-NetUDPEndpoint -LocalPort ${config.port}).OwningProcess\n`, 'Write-Output $proc.Id\n'])
    PortCheck.stdout.on('data', data => {
        const PID = parseInt(data.toString().trim())
        process.kill(PID), console.log(`Killed Process ${PID} running on port ${config.port}!`)
        PortCheck.kill()
    })
    PortCheck.stderr.on('data', () => PortCheck.kill())


    //? Prepare Torch for Launch
    console.log('Preparing Files...')
    await FilePrep(), console.log('Files Ready!')

    //? Import OnStart Scripts
    config.scripts.OnStart.forEach(script => {
        require(`${config.scripts.path}/OnStart/${script}.js`)()
        console.log(`OnStart - ${script}`)
    })

    //? Launch Torch
    console.log('Launching Instance...'), Discord.Notification(`⏳ ${config.name} is Starting...`, '#0fc1f2')
    Torch = spawn(`${config.dir}\\Torch.Server.exe`)


    //? Critical Process Output Stream
    Torch.stdout.on('data', async data => {
        data = data.toString('utf8')
        if (config.outputGameLog || config.outputGameLog === undefined) console.log(data)

        data.split('\n').forEach(line => {
            if (!line.trim()) return
            line = line.trim()

            //? Parse Logs
            var log = line.substring(line.indexOf(']') + 1).trim()
            var time = line.split(']')[0].trim() + ']'

            //? Send Logs to each OnLog Script
            config.scripts.OnLog.forEach(script => {
                require(`${config.scripts.path}/OnLog/${script}.js`)(log, time)
            })



            //? Detect Torch Ready
            if (log === 'Keen: Game ready...') Discord.Notification(`✅ ${config.name} is Ready to Join!`, '#33d438')

            //? Detect Safe Stoppage of Torch then Restart
            if (log === 'Torch: Server stopped.' || log === 'ALE_RestartWatchdog.RestartManager: Server hasnt yet restarted. Attempt force restart!') {
                Discord.Notification(`⛔ ${config.name} has Stopped`, '#d43333')
                Torch.kill()
                config.scripts.OnStop.forEach(script => {
                    require(`${config.scripts.path}/OnStop/${script}.js`)(msg, client)
                    console.log(`OnStop - ${script}`)
                })
            }

            //? Detect Torch Crash
            if (log === 'Initializer: Keen broke the minidump, sorry.') {
                Discord.Notification(`❌ ${config.name} has Crashed!`, '#d43333')
                Torch.kill()
                config.scripts.OnStop.forEach(script => {
                    require(`${config.scripts.path}/OnStop/${script}.js`)(msg, client)
                    console.log(`OnStop - ${script}`)
                })
            }

            //? Shift Que
            if (log === 'Torch: Initializing server') {
                BusyJson.que.shift()
                if (BusyJson.que.length > 0) fs.writeFileSync(`${config.dir}\\BUSY`, JSON.stringify(BusyJson))
                else fs.unlinkSync(`${config.dir}\\BUSY`)
            }

        })
    })

    Torch.on('exit', () => {
        if (manualStop) return
        setTimeout(StartProcess, 8000)
        config.scripts.OnStop.forEach(script => {
            require(`${config.scripts.path}/OnStop/${script}.js`)(msg, client)
            console.log(`OnStop - ${script}`)
        })
    })
}


//? Kill Torch Process & Keep Stopped
function Stop() {
    manualStop = true
    if (Torch) Torch.kill(), Torch = undefined
    Discord.Notification(`⛔ ${config.name} has been Stopped`, '#d43333')
}

//? Start a Manually Stopped Torch Process
function Start() {
    manualStop = false
    StartProcess()
}



//!
//! Discord Functions
//!

client.on('messageCreate', msg => {
    if (msg.author.bot) return

    config.scripts.OnCommand.forEach(script => {
        require(`${config.scripts.path}/OnCommand/${script}.js`)(msg, client)
    })

    if (msg.channel.id != command_channel.id) return

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
        Stop(), setTimeout(Start, 5000)
        msg.reply(`Restart Initiated for ${config.name}.`)
        Discord.Notification(`🔧 ${config.name} has been restarted by a Staff Member.`, '#a13ffc')
    }
})



module.exports = {
    Start,
    Stop
}