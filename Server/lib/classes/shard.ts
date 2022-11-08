//? Dependencies

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'


import PluginManager from './plugins'



//? Class Definitions

export default class ShardManager implements Shard {
    _id: ObjectId

    id: string
    name: string
    enabled: boolean
    community: string

    discord: ShardDiscord

    status: ShardStatus
    settings: ShardSettings

    plugins: ShardPlugins[]
    mods: []


    constructor(guildId: string, shardId: string) {
        this._id = new ObjectId()

        this.id = shardId.toLowerCase()
        this.name = shardId.toLowerCase()
        this.enabled = false
        this.community = guildId

        this.discord = {
            notifications: {
                public: {
                    enabled: false,
                    channel: null,
                    types: ['none']
                },
                admin: {
                    enabled: false,
                    channel: null,
                    types: ['none']
                }
            }
        }

        this.status = {
            state: 'offline',
            heartbeat: new Date(),
            shouldBeRunning: false
        }

        this.settings = {
            servername: 'My New Server',
            worldname: 'My New World',

            port: 27016,
            maxplayers: 8,
            password: null,

            world: null
        }

        this.plugins = []
        this.mods = []
    }



    fetch(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const _shard = this

            const Shards = await Collection('shards')
            const Shard = (await Shards.findOne({ _id: this._id }) || await Shards.findOne({ id: this.id, community: this.community })) as Shard
            if (!Shard) return reject('Shard could not be found!')

            this._id = Shard._id
            this.name = Shard.name
            this.enabled = Shard.enabled

            this.discord = Shard.discord || _shard.discord

            this.status = Shard.status || _shard.status
            this.settings = Shard.settings || _shard.settings

            this.plugins = Shard.plugins || _shard.plugins
            // this.mods = Shard.mods || []

            return resolve('Shard successfully fetched from database!')

        })
    }

    save(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Shards = await Collection('shards')

            const isNew = await Shards.findOne({ _id: this._id }).then(shard => shard ? true : false).catch(err => { console.error(err); return true })
            if (isNew && await (await Shards.find({ community: this.community }).toArray()).length >= 20) return reject('Maximum Quantity of Servers has been reached for this Community! (20)')


            Shards.updateOne({ _id: this._id }, { $set: this }, { upsert: true })
                .then(res => {
                    if (!res.acknowledged) return reject('Shard failed to save to the database')
                    return resolve('Shard successfully saved to the database!')
                })
                .catch(reject)

        })
    }

    delete(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Shards = await Collection('shards')

            Shards.deleteOne({ _id: this._id })
                .then(res => {
                    if (!res.acknowledged) return reject('Failed to delete Shard! (No Acknowledgement, Shard may not exist)')
                    return resolve('Shard successfully deleted from the database!')
                })
                .catch(reject)

        })
    }


    addPluginPack(guid: string): Promise<PluginPack> {
        return new Promise(async (resolve, reject) => {

            const Pack = new PluginManager(this.community as string, guid)
            if (!await Pack.fetch().catch(() => false)) return reject('A plugin package with that GUID does not exist!')

            if (this.plugins.find(p => p.guid == Pack._id.toString())) return reject('This server already has that plugin package added!')

            this.plugins.push({guid: Pack._id.toString(), name: Pack.name})

            this.save()
                .then(() => resolve(Pack))
                .catch(reject)

        })
    }

    removePluginPack(guid: string): Promise<PluginPack> {
        return new Promise(async (resolve, reject) => {

            const Pack = new PluginManager(this.community as string, guid)
            if (!await Pack.fetch().catch(() => false)) console.warn('Removing Plugin Pack from Shard as it no longer exists.')

            if (!this.plugins.find(p => p.guid == Pack._id.toString())) return reject("This server does not have that plugin package added!")

            this.plugins.splice(this.plugins.findIndex(p => p.guid == Pack._id.toString()), 1)

            this.save()
                .then(() => resolve(Pack))
                .catch(reject)

        })
    }
}