//? Dependencies

import fs from 'fs'

import xml2js from 'xml2js'



//? Xml2js Parser

const Parser = new xml2js.Parser()
const Builder = new xml2js.Builder()



//? Read Stream

export const ReadStream = (file: string, text?: boolean) => {
    return new Promise((resolve, reject) => {

        let data: string = ''

        const stream = fs.createReadStream(file)

        // console.log(`Streaming File to Client - "${file}"`)

        stream.on('data', chunk => data += chunk)
        stream.on('error', reject)
        stream.on('end', () => {
            // console.log(`File Stream Complete - "${file}"`)

            if (text) return resolve(data)

            Parser.parseStringPromise(data).then(resolve).catch(reject)
        })

    })
}


//? Write Stream

export const WriteToFile = (file: string, data: object | string) => {
    return new Promise(async (resolve, reject) => {

        if (!data) return reject('No Data Provided')
        if (typeof data == 'object') data = Builder.buildObject(data)
        if (!data) return reject('Failed to Build Object')

        fs.promises.writeFile(file, data)
            .then(() => resolve(`Successfully Updated File: ${file}`))
            .catch(reject)

    })
}