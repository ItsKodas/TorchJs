const Server = require('C:\\snapshot\\TorchJs\\main.js')
const World = require('C:\\snapshot\\TorchJs\\Modules\\editor.js')
const Discord = require('C:\\snapshot\\TorchJs\\Modules\\discord.js')

module.exports = async (msg) => {

    var auth = `${process.env.discord.prefix}reset ${process.env.name} [confirm]`

    if (msg.content !== auth.toLowerCase()) return
    if (msg.author.id !== "240786290600181761") return msg.reply('You do not have access to this command!')


    msg.channel.send('Stopping server to run cleanup script...')
    Discord.Notification(`⚠️ An Administrator has ran a world reset script on \`${process.env.name}\`, please standby.`)

    Server.Stop()

    await World.GetSandboxSBC().then(Sandbox => {

        Sandbox.MyObjectBuilder_Checkpoint.Factions = [{
            Factions: [{}],
            Players: [{}],
            Relations: [{}],
            RelationsWithPlayers: [{}],
            Requests: [{}],
            PlayerToFactionsVis: [{}]
        }]

        Sandbox.MyObjectBuilder_Checkpoint.Identities = [{ dictionary: [{}] }]
        Sandbox.MyObjectBuilder_Checkpoint.AllPlayersData = [{ dictionary: [{}] }]
        Sandbox.MyObjectBuilder_Checkpoint.AllPlayersColors = [{ dictionary: [{}] }]
        Sandbox.MyObjectBuilder_Checkpoint.NonPlayerIdentities = [{ dictionary: [{}] }]
        Sandbox.MyObjectBuilder_Checkpoint.Gps = [{ dictionary: [{}] }]


        var Components = []
        var Whitelist = [
            'MyObjectBuilder_LocalizationSessionComponent',
            'MyObjectBuilder_SharedStorageComponent',
            'MyObjectBuilder_VisualScriptManagerSessionComponent',
            'MyObjectBuilder_SpaceFaunaComponent',
            'MyObjectBuilder_AIComponent',
            'MyObjectBuilder_CampaignSessionComponent',
            'MyObjectBuilder_EnvironmentBotSpawningSystem',
            'MyObjectBuilder_CoordinateSystem',
            'MyObjectBuilder_SectorWeatherComponent',
            'MyObjectBuilder_SpacePlanetTrackComponent',
            'MyObjectBuilder_CutsceneSessionComponent',
            'MyObjectBuilder_AntennaSessionComponent',
            'MyObjectBuilder_SessionComponentResearch',
            'MyObjectBuilder_Encounters',
            'MyObjectBuilder_WorldGenerator',
            'MyObjectBuilder_PirateAntennas'
        ]
        for (obj of Sandbox.MyObjectBuilder_Checkpoint.SessionComponents[0].MyObjectBuilder_SessionComponent) {
            if (Whitelist.includes(obj.$['xsi:type'])) Components.push(obj)
        }
        Sandbox.MyObjectBuilder_Checkpoint.SessionComponents[0].MyObjectBuilder_SessionComponent = Components

        World.UpdateSandboxSBC(Sandbox)
    })


    await World.GetSandboxSBS().then(Sandbox => {

        var Planets = []

        for (obj of Sandbox.MyObjectBuilder_Sector.SectorObjects[0].MyObjectBuilder_EntityBase) {
            if (obj.$['xsi:type'] !== 'MyObjectBuilder_Planet') continue

            obj.ComponentContainer = [{ Components: [{}] }]
            Planets.push(obj)
        }

        Sandbox.MyObjectBuilder_Sector.SectorObjects[0].MyObjectBuilder_EntityBase = Planets

        World.UpdateSandboxSBS(Sandbox)
    })


    Server.Start()

    msg.reply('Cleanup script complete, server rebooting...')
}