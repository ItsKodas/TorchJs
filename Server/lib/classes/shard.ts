//? Dependencies

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'



//? Class Definitions

export default class ShardManager implements Shard {
    _id: ObjectId

    id: string
    name: string
    enabled: boolean
    community: string

    status: ShardStatus
    settings: ShardSettings


    constructor(guildId: string, shardId: string) {
        this._id = new ObjectId()

        this.id = shardId.toLowerCase()
        this.name = shardId.toLowerCase()
        this.enabled = false
        this.community = guildId

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
    }



    fetch(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Shards = await Collection('shards')
            const Shard = (await Shards.findOne({ _id: this._id }) || await Shards.findOne({ id: this.id, community: this.community })) as Shard
            if (!Shard) return reject('Shard could not be found!')

            this._id = Shard._id
            this.name = Shard.name
            this.enabled = Shard.enabled

            this.status = Shard.status
            this.settings = Shard.settings

            return resolve('Shard successfully fetched from database!')
            
        })
    }

    save(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Shards = await Collection('shards')
            // const Shard = (await Shards.findOne(this._id) || await Shards.findOne({ id: this.id, community: this.community })) as Shard
            // if (!Shard) return reject('Shard could not be found!')

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
}