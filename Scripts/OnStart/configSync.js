const fs = require('fs')
const dir = `${process.env.dir}\\${process.env.instance}`
const Editor = require('C:\\snapshot\\TorchJs\\Modules\\editor.js')
const ncp = require('ncp').ncp



module.exports = () => {

    fs.copyFileSync(`./Horizons/Configs/BlockLimiter.cfg`, `${dir}/BlockLimiter.cfg`)
    fs.copyFileSync(`./Horizons/Configs/QuantumHangar.cfg`, `${dir}/QuantumHangar.cfg`)


    Editor.ParseXML(`./Horizons/Configs/Essentials.cfg`).then(Essentials => {
        Essentials.EssentialsConfig.AutoCommands[0].AutoCommand.forEach((obj, index) => {
            if (!obj.$) return
            if (!obj.$.for.toLowerCase().split(',').includes(process.env.name.toLowerCase())) Essentials.EssentialsConfig.AutoCommands[0].AutoCommand.splice(index, 1)
        })
        Essentials.EssentialsConfig.InfoCommands[0].InfoCommand.forEach((obj, index) => {
            if (!obj.$) return
            if (!obj.$.for.toLowerCase().split(',').includes(process.env.name.toLowerCase())) Essentials.EssentialsConfig.InfoCommands[0].InfoCommand.splice(index, 1)
        })

        for (obj in Essentials.EssentialsConfig) {
            if (Essentials.EssentialsConfig[obj][0])
                if (Essentials.EssentialsConfig[obj][0].$)
                    if (!Essentials.EssentialsConfig[obj][0].$.for.toLowerCase().split(',').includes(process.env.name.toLowerCase())) delete Essentials.EssentialsConfig[obj]
        }

        fs.writeFileSync(`${dir}/Essentials.cfg`, Editor.BuildXML(Essentials))
    })



    fs.readdirSync('./Horizons/Storage/Instance').forEach(file => {
        if (fs.lstatSync(`./Horizons/Storage/Instance/${file}`).isDirectory()) {
            if (fs.existsSync(`${dir}/Storage/${file}`)) fs.rmdirSync(`${dir}/Storage/${file}`, { recursive: true })
            fs.mkdirSync(`${dir}/Storage/${file}`)
            ncp(`./Horizons/Storage/Instance/${file}`, `${dir}/Storage/${file}`, err => { if (err) console.log(err) })

        } else {
            fs.copyFileSync(`./Horizons/Storage/Instance/${file}`, `${dir}/Storage/${file}`)
        }
    })

    fs.readdirSync('./Horizons/Storage/World').forEach(file => {
        if (fs.lstatSync(`./Horizons/Storage/World/${file}`).isDirectory()) {
            if (fs.existsSync(`${dir}/Saves/${process.env.world}/Storage/${file}`)) fs.rmdirSync(`${dir}/Saves/${process.env.world}/Storage/${file}`, { recursive: true })
            fs.mkdirSync(`${dir}/Saves/${process.env.world}/Storage/${file}`)
            ncp(`./Horizons/Storage/World/${file}`, `${dir}/Saves/${process.env.world}/Storage/${file}`, err => { if (err) console.log(err) })

        } else {
            fs.copyFileSync(`./Horizons/Storage/World/${file}`, `${dir}/Saves/${process.env.world}/Storage/${file}`)
        }
    })

}