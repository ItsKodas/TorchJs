//? Dependencies

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'



//? Interfaces





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

        if (this.id.match(/[^a-z0-9_()]/)) throw new Error('Shard ID must only contain letters, numbers, and underscores.')
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

            return resolve('Shard fetched successfully from database!')
        })
    }

    save(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Shards = await Collection('shards')
            // const Shard = (await Shards.findOne(this._id) || await Shards.findOne({ id: this.id, community: this.community })) as Shard
            // if (!Shard) return reject('Shard could not be found!')

            Shards.updateOne({ _id: this._id }, { $set: this }, { upsert: true })
                .then(res => {
                    if (!res.acknowledged) return reject('Shard update failed!')
                    return resolve('Shard saved successfully to the database!')
                })
                .catch(reject)
        })
    }
}



// Collection('shards').then(async shards => {
//     const Clashes = await shards.findOne({ id: this.id, community: this.community })
//     if (Clashes) throw new Error('Shard ID is already in use.')

//     shards.insertOne(this)
//         .then(res => {
//             if (!res.acknowledged) throw new Error('Failed to Create Shard on the Database!')
//             this._id = res.insertedId
//         })
// })