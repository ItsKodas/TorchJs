const fs = require('fs')

const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()
const xmlBuilder = new xml2js.Builder()


function ParseXML(dir) {
    return new Promise((resolve, reject) => {
        xmlParser.parseString(fs.readFileSync(dir, 'utf8'), (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })
}

function BuildXML(obj) {
    return xmlBuilder.buildObject(obj)
}



async function GetTorchCFG() {
    return await ParseXML(`${process.env.dir}/Torch.cfg`)
}

async function UpdateTorchCFG(obj) {
    fs.writeFileSync(`${process.env.dir}/Torch.cfg`, await BuildXML(obj))
}



async function GetSEDConfig() {
    return await ParseXML(`${process.env.dir}/${process.env.instance}/SpaceEngineers-Dedicated.cfg`)
}

async function UpdateSEDConfig(obj) {
    fs.writeFileSync(`${process.env.dir}/${process.env.instance}/SpaceEngineers-Dedicated.cfg`, await BuildXML(obj))
}



async function GetSandboxSBC() {
    return await ParseXML(`${process.env.dir}/${process.env.instance}/Saves/${process.env.world}/Sandbox.sbc`)
}

async function GetSandboxSBS() {
    return await ParseXML(`${process.env.dir}/${process.env.instance}/Saves/${process.env.world}/SANDBOX_0_0_0_.sbs`)
}

async function GetSandboxConfig() {
    return await ParseXML(`${process.env.dir}/${process.env.instance}/Saves/${process.env.world}/Sandbox_config.sbc`)
}



async function UpdateSandboxSBC(obj) {
    fs.writeFileSync(`${process.env.dir}/${process.env.instance}/Saves/${process.env.world}/Sandbox.sbc`, await BuildXML(obj))
}

async function UpdateSandboxSBS(obj) {
    fs.writeFileSync(`${process.env.dir}/${process.env.instance}/Saves/${process.env.world}/SANDBOX_0_0_0_.sbs`, await BuildXML(obj))
    if (fs.existsSync(`${process.env.dir}/${process.env.instance}/Saves/${process.env.world}/SANDBOX_0_0_0_.sbsB5`)) fs.unlinkSync(`${process.env.dir}/${process.env.instance}/Saves/${process.env.world}/SANDBOX_0_0_0_.sbsB5`)
}

async function UpdateSandboxConfig(obj) {
    fs.writeFileSync(`${process.env.dir}/${process.env.instance}/Saves/${process.env.world}/Sandbox_config.sbc`, await BuildXML(obj))
}



module.exports = {
    ParseXML,
    BuildXML,

    GetTorchCFG,
    UpdateTorchCFG,

    GetSEDConfig,
    UpdateSEDConfig,

    GetSandboxSBC,
    GetSandboxSBS,
    GetSandboxConfig,

    UpdateSandboxSBC,
    UpdateSandboxSBS,
    UpdateSandboxConfig
}