//? Dependencies

import Config from '@lib/config'

import Query from '@api/standard'

import PrepClient from '@lib/torch/prepare'


import * as ParseOutput from './parseOutput'


import { spawn } from 'child_process'


//? Types

import type { ChildProcess } from 'child_process'



//? Variables




//? Torch Client

export default class Client implements TorchClient {

    id: string

    torch: Config['torch']
    instance: Config['instances'][0]
    isConnected: boolean

    client: ChildProcess | null


    constructor(id: string) {

        this.id = id

        this.torch = Config.torch
        this.instance = Config.instances.find(i => i.id == id) as Config['instances'][0]
        this.isConnected = false

        this.client = null

    }



    async connect() {
        return new Promise((resolve, reject) => {

            if (this.isConnected) return resolve('Client is already connected to the server.')

            Query(this.id, 'establish', 'POST')
                .then((res: any) => {
                    if (res.status != 200) return reject(res.message)

                    this.isConnected = true

                    resolve(res.message)
                })
                .catch(err => reject(`Failed to Connect '${this.id}' to the Server.`))

        })
    }


    async initialize() {
        return new Promise((resolve, reject) => {

            if (!this.isConnected) return reject(`Client '${this.id}' needs to be connected to the server to initialize itself.`)

            PrepClient(this)
                .then(resolve)
                .catch(reject)

        })
    }


    async start() {
        return new Promise(async (resolve, reject) => {

            if (!this.isConnected) return reject(`Client '${this.id}' needs to be connected to the server to start.`)

            await this.initialize()
                .then(res => {
                    console.info(res)
                    console.info(`Starting '${this.id}'...`)

                    this.client = spawn(`${this.torch.directory}/${this.torch.executable}`, { detached: false })


                    this.client.stdout?.on('data', (data) => data.toString().split('\n').forEach((l: string) => {

                        const line = ParseOutput.ParseLine(l)
                        if (!line) return

                        if (line.type == 'info') {
                            if (line.data.startsWith('Keen: Game ready...')) return resolve(`Client '${this.id}' is ready!`)
                        }

                        if (line.type == 'fatal') {
                            this.client?.kill()
                            this.client = null
                            return reject(`Client '${this.id}' has encountered a fatal error.`)
                        }

                    }))

                    this.client.on('exit', (code) => { console.error(code) })

                })
                .catch(reject)


        })
    }

}