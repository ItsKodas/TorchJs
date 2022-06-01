const fs = require('fs')

const Rollback = require('./rollback.js')

const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser()
const xmlBuilder = new xml2js.Builder()


function ParseXML(dir) {
    return new Promise((resolve, reject) => {

        fs.readFile(dir, 'utf-8', (err, data) => {
            if (err) return reject(`Failed to read file: ${dir}`)

            xmlParser.parseStringPromise(data)
                .then(result => resolve(result))
                .catch(err => reject(`Failed to parse file: ${dir}`))
        })
    })
}

function BuildXML(obj, r) {
    const XML = xmlBuilder.buildObject(obj)
    
    if (r) return XML.replaceAll('&amp;', '&')
    else return XML
}



async function GetTorchCFG() {
    return await ParseXML(`${process.env.dir}/Torch.cfg`).catch(err => console.log(err))
}

async function UpdateTorchCFG(obj, r) {
    fs.writeFileSync(`${process.env.dir}/Torch.cfg`, await BuildXML(obj, r))
}



async function GetSEDConfig() {
    return await ParseXML(`${process.env.instances || process.env.dir}/${process.env.instance}/SpaceEngineers-Dedicated.cfg`).catch(err => console.log(err))
}

async function UpdateSEDConfig(obj, r) {
    fs.writeFileSync(`${process.env.instances || process.env.dir}/${process.env.instance}/SpaceEngineers-Dedicated.cfg`, await BuildXML(obj, r))
}



async function GetSandboxSBC() {
    return await ParseXML(`${process.env.instances || process.env.dir}/${process.env.instance}/Saves/${process.env.world}/Sandbox.sbc`).catch(() => Rollback.WorldFile('Sandbox.sbc'))
}

async function GetSandboxSBS() {
    return await ParseXML(`${process.env.instances || process.env.dir}/${process.env.instance}/Saves/${process.env.world}/SANDBOX_0_0_0_.sbs`).catch(() => Rollback.WorldFile('SANDBOX_0_0_0_.sbs'))
}

async function GetSandboxConfig() {
    return await ParseXML(`${process.env.instances || process.env.dir}/${process.env.instance}/Saves/${process.env.world}/Sandbox_config.sbc`).catch(() => Rollback.WorldFile('Sandbox_config.sbc'))
}



async function UpdateSandboxSBC(obj, r) {
    fs.writeFileSync(`${process.env.instances || process.env.dir}/${process.env.instance}/Saves/${process.env.world}/Sandbox.sbc`, await BuildXML(obj, r))
}

async function UpdateSandboxSBS(obj, r) {
    fs.writeFileSync(`${process.env.instances || process.env.dir}/${process.env.instance}/Saves/${process.env.world}/SANDBOX_0_0_0_.sbs`, await BuildXML(obj, r))
    if (fs.existsSync(`${process.env.instances || process.env.dir}/${process.env.instance}/Saves/${process.env.world}/SANDBOX_0_0_0_.sbsB5`)) fs.unlinkSync(`${process.env.instances || process.env.dir}/${process.env.instance}/Saves/${process.env.world}/SANDBOX_0_0_0_.sbsB5`)
}

async function UpdateSandboxConfig(obj, r) {
    fs.writeFileSync(`${process.env.instances || process.env.dir}/${process.env.instance}/Saves/${process.env.world}/Sandbox_config.sbc`, await BuildXML(obj, r))
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