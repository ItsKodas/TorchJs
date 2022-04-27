const fs = require('fs')


const Timer = ms => new Promise(res => setTimeout(res, ms))


async function ValidateQue() {
    await fs.promises.readFile(`${process.env.dir}\\BUSY`, 'utf-8')
        .then(data => JSON.parse(data))
        .then(json => {
            if (json.que[0] !== process.env.port) return console.log("Critical Error: Que is not valid, restarting..."), require('../main.js').Start()
            json.timestamp = new Date()
            fs.writeFileSync(`${process.env.dir}\\BUSY`, JSON.stringify(json))
        })
}



module.exports = {
    Timer,
    ValidateQue
}