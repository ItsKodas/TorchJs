const Discord = require('C:\\snapshot\\TorchJs\\Modules\\discord.js')
const Editor = require('C:\\snapshot\\TorchJs\\Modules\\editor.js')
const Math3D = require('math3d')
const Vector = Math3D.Vector3

var auth = `!trade ${process.env.name}`

module.exports = async (msg) => {
    if (msg.channel.id != process.env.discord.notification_channel) return
    if (msg.content !== auth.toLowerCase()) return
    if (!process.env.sectors) return
    if (!process.env.sectors[process.env.name]) return

    var Sector = {
        Vector: new Vector(process.env.sectors[process.env.name].pos[0], process.env.sectors[process.env.name].pos[1], process.env.sectors[process.env.name].pos[2]),
        Radius: process.env.sectors[process.env.name].radius
    }

    Editor.GetSandboxSBC().then(async (SBC) => {

        var orbitId = 0
        var planetId = 0

        var orbitalStations = []
        var surfaceOutposts = []

        SBC.MyObjectBuilder_Checkpoint.Factions[0].Factions[0].MyObjectBuilder_Faction.forEach(Faction => {
            if (Faction.Stations[0] === '') return
            Faction.Stations[0].MyObjectBuilder_Station.forEach((Station) => {
                var StationVector = new Vector(parseFloat(Station.Position[0].$.x), parseFloat(Station.Position[0].$.y), parseFloat(Station.Position[0].$.z))
                var Distance = Sector.Vector.distanceTo(StationVector)
                if (Distance < Sector.Radius) {

                    var OnPlanet = false
                    if (Station.IsOnPlanetWithAtmosphere[0] === 'true') OnPlanet = true, planetId++
                    else OnPlanet = false, orbitId++

                    var StationName = OnPlanet ? `Surface Outpost ${planetId}` : `Orbital Station ${orbitId}`

                    var field = {
                        name: StationName,
                        value: `\`GPS:${StationName}:${Math.floor(Station.Position[0].$.x)}:${Math.floor(Station.Position[0].$.y)}:${Math.floor(Station.Position[0].$.z)}:#FC7703:\``
                    }

                    OnPlanet ? surfaceOutposts.push(field) : orbitalStations.push(field)
                }
            })
        })

        var embed = {
            color: '#FC7703',
            author: {
                name: `[${process.env.name}] Trade Stations`,
            },
            fields: orbitalStations.concat(surfaceOutposts)
        }

        msg.channel.send({ embeds: [embed] })
            .then(msg2 => {
                setTimeout(() => {
                    msg.delete().catch(err => console.log(err))
                    msg2.delete().catch(() => console.log('Failed to delete message!'))
                }, 1000 * 60 * 5)
            })
            .catch(err => console.log(err))

    })
}