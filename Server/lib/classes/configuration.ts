//? Dependencies

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'


import { pbkdf2Sync, randomBytes } from 'crypto'



//? Class Definitions

export default class ConfigManager implements ConfigPreset {
    _id: ObjectId

    name: string
    community: string

    file: string | null
    type: ConfigPreset['type']

    session: ConfigSession | null
    variables: ConfigVariable[] | null

    data: string | null


    constructor(guildId: string, type?: ConfigPreset['type'] | null, guid?: string) {
        this._id = ObjectId.isValid(guid || '') ? new ObjectId(guid) : new ObjectId()

        this.name = 'New Configuration'
        this.community = guildId

        this.type = type || 'server'
        this.file = this.type == 'server' ? 'SpaceEngineers-Dedicated.cfg' : null

        this.session = null
        this.variables = null

        this.data = null
    }



    fetch(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const _config = this

            const Configs = await Collection('configs')
            const Config = await Configs.findOne({ _id: this._id }) as ConfigPreset
            if (!Config) return reject('Configuration could not be found!')


            this.name = Config.name || _config.name
            this.community = Config.community || _config.community

            this.file = Config.file || _config.file
            this.type = Config.type || _config.type

            this.session = Config.session || _config.session
            this.variables = Config.variables || _config.variables

            this.data = Config.data || _config.data


            return resolve('Configuration successfully fetched from database!')

        })
    }

    save(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Configs = await Collection('configs')

            Configs.updateOne({ _id: this._id }, { $set: this }, { upsert: true })
                .then(res => {
                    if (!res.acknowledged) return reject('Configuration failed to save to the database')
                    return resolve('Configuration successfully saved to the database!')
                })
                .catch(reject)

        })
    }

    delete(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Configs = await Collection('configs')

            Configs.deleteOne({ _id: this._id })
                .then(res => {
                    if (!res.acknowledged) return reject('Failed to delete Configuration! (No Acknowledgement, Configuration may not exist)')
                    return resolve('Configuration successfully deleted from the database!')
                })
                .catch(reject)

        })
    }


    startSession(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (this.session) return reject('A Session is already Active for this Configuration!')

            this.session = {
                id: randomBytes(16).toString('base64url'),

                creationDate: new Date(),
                lastUpdated: new Date(),

                data: this.data || ''
            }

            this.save()
                .then(() => resolve('Session successfully started!'))
                .catch(reject)

        })
    }


}