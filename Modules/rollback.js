const fs = require('fs')



async function WorldFile(file) {

    if (!fs.existsSync(`${process.env.instances || process.env.dir}\\${process.env.instance}\\Saves\\${process.env.world}\\Backup`)) return console.log(`A Critical World File is Missing and no backups are available: ${file}`), process.exit(1)

    const Backups = fs.readdirSync(`${process.env.instances || process.env.dir}\\${process.env.instance}\\Saves\\${process.env.world}\\Backup`)

    if (!fs.existsSync(`${process.env.instances || process.env.dir}\\${process.env.instance}\\Saves\\${process.env.world}\\Backup\\${Backups[Backups.length - 1]}\\${file}`)) return console.log(`A Critical World File is Missing and no backups are available: ${file}`), process.exit(1)

    return await require('./editor.js').ParseXML(`${process.env.instances || process.env.dir}\\${process.env.instance}\\Saves\\${process.env.world}\\Backup\\${Backups[Backups.length - 1]}\\${file}`).catch(err => { throw new error(err) })

}



module.exports = {
    WorldFile
}