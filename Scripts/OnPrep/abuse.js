if (process.env.name !== 'Deepspace') return

const fs = require('fs')

var Que = []
var PrevLog
var LogDir

fs.readdirSync(`${process.env.dir}/Logs`).forEach(log => { if (log.includes('AdminLog')) LogDir = log })
PrevLog = fs.readFileSync(`${process.env.dir}/Logs/${LogDir}`, 'utf8')


async function PullLogs() {
    var PrevDir = LogDir
    fs.readdirSync(`${process.env.dir}/Logs`).forEach(log => { if (log.includes('AdminLog')) LogDir = log })
    var NewLog = fs.readFileSync(`${process.env.dir}/Logs/${LogDir}`, 'utf8')
    var Log = NewLog.replace(PrevLog, '').split('\r\n')
    PrevLog = NewLog
    if (LogDir !== PrevDir) return

    if (!Log[0] && !Log[1] && !Log[2]) return

    var Temp = {}
    var Chunks = []
    Log.forEach(line => {
        if (!line || line.includes('Lauching Big Brother Protocal')) return
        if (line.includes('AdminLogger:')) {
            if (Temp.parent) console.log(Temp), Chunks.push(Temp), Temp = {}
            return Temp['parent'] = line.split('AdminLogger: ')[1]
        }

        if (!Temp['content']) Temp['content'] = []
        Temp['content'].push(line)
    })
    if (Temp.parent) Chunks.push(Temp)

    if (Chunks.lengh > 30) return

    Chunks.forEach(chunk => Que.push(chunk))
} setInterval(PullLogs, 1000 * 10), PullLogs()


async function QueDischarge() {

    if (!process.Discord) return
    var client = process.Discord
    var thread = client.channels.cache.get('928095777518141520')

    var Log = Que.shift()
    if (!Log) return
    console.log('Discharged:', Log)

    var color = '#ffffff'
    if (Log.parent.includes('enabled')) color = '#1c86ff'
    if (Log.parent.includes('disabled')) color = '#0f4480'
    if (Log.parent.includes('in creative mode!')) color = '#ff672b'
    if (Log.parent.includes('the following grids')) color = '#a126ff'
    if (Log.parent.includes('removed grid')) color = '#ff4238'

    if (!Log.content) {
        Que.forEach((chunk, index) => {
            if (chunk.parent !== Log.parent) return
            Que.splice(index, 1)
            if (!Log['count']) return Log['count'] = 1
            Log['count'] += 1
        })
    }


    if (!Log.count && !Log.content) var msg = {
        description: `${Log.parent}`,
        color: color
    }
    if (Log.count) var msg = {
        description: `${Log.parent}`,
        color: color,
        footer: {
            text: `Counted ${Log.count}x Cases`
        }
    }
    if (Log.content) var msg = {
        description: `${Log.parent}\n\n>>> ${Log.content.join('\n')}`,
        color: color
    }

    thread.send({ embeds: [msg] })


} setInterval(QueDischarge, 1500)