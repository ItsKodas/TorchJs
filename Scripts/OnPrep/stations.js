const Editor = require('C:\\snapshot\\TorchJs\\Modules\\editor.js')
const Math3D = require('math3d')
const Vector = Math3D.Vector3

if (!process.env.sectors) return
if (!process.env.sectors[process.env.name]) return


var Sector = {
    Vector: new Vector(process.env.sectors[process.env.name].pos[0], process.env.sectors[process.env.name].pos[1], process.env.sectors[process.env.name].pos[2]),
    Radius: process.env.sectors[process.env.name].radius
}

Editor.GetSandboxSBC().then(async (SBC) => {
    var Factions = []

    SBC.MyObjectBuilder_Checkpoint.Factions[0].Factions[0].MyObjectBuilder_Faction.forEach(Faction => {
        var Stations = []
        if (Faction.Stations[0] === '') return

        Faction.Stations[0].MyObjectBuilder_Station.forEach(Station => {
            var StationVector = new Vector(parseFloat(Station.Position[0].$.x), parseFloat(Station.Position[0].$.y), parseFloat(Station.Position[0].$.z))
            var Distance = Sector.Vector.distanceTo(StationVector)
            if (Distance < Sector.Radius) Stations.push(Station), console.log(`${Station.PrefabName[0]} (${Station.Id[0]}) has been verified @[${Math.floor(Station.Position[0].$.x)}, ${Math.floor(Station.Position[0].$.y)}, ${Math.floor(Station.Position[0].$.z)}]`)
        })

        Faction.Stations[0].MyObjectBuilder_Station = Stations
        Factions.push(Faction)
    })

    SBC.MyObjectBuilder_Checkpoint.Factions[0].Factions[0].MyObjectBuilder_Faction = Factions

    Editor.UpdateSandboxSBC(SBC)
})



// Config Format:

// "sectors": {
//     "Earth": {
//         "pos": [0, 0, 0],
//         "radius": 50000
//     },
//     "Moon": {
//         "pos": [107284.5, 62584.5, 574.5],
//         "radius": 50000
//     },
//     "Ravcor": {
//         "pos": [-245201.44, 1156459.23, -194500.83],
//         "radius": 50000
//     },
//     "Badlands": {
//         "pos": [-439567.09, 188927.55, -541083.85],
//         "radius": 280000
//     },
//     "Outer Rim": {
//         "pos": [296843.41, 798808.35, 270646.21],
//         "radius": 200000
//     }
// }