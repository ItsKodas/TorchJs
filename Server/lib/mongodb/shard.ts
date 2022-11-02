//? Dependencies

import { Collection } from "."

import { ObjectId } from "mongodb"



//? Enable

export function Enable(community: string, id: string) {
    return new Promise(async (resolve, reject) => {
        const Shards = await Collection('shards')

        const Shard = await Shards.findOne({ community: community, _id: new ObjectId(id) }) as Shard
        if (!Shard) return reject('Shard not found')

        await Shards.updateOne({ community: community, _id: new ObjectId(id) }, { $set: { enabled: true } })

        resolve({
            message: 'Shard has successfully been enabled',
            shardUID: Shard._id,
            shardId: Shard.id
        })
    })
}


//? Disable

export function Disable(community: string, id: string) {
    return new Promise(async (resolve, reject) => {
        const Shards = await Collection('shards')

        const Shard = await Shards.findOne({ community: community, _id: new ObjectId(id) }) as Shard
        if (!Shard) return reject('Shard not found')

        await Shards.updateOne({ community: community, _id: new ObjectId(id) }, { $set: { enabled: false } })

        resolve({
            message: 'Shard has successfully been disabled',
            shardUID: Shard._id,
            shardId: Shard.id
        })
    })
}


//? Delete

export function Delete(community: string, id: string) {
    return new Promise(async (resolve, reject) => {
        const Shards = await Collection('shards')

        const Shard = await Shards.findOne({ community: community, _id: new ObjectId(id) }) as Shard
        if (!Shard) return reject('Shard not found')

        await Shards.deleteOne({ community: community, _id: new ObjectId(id) })

        resolve({
            message: 'Shard has successfully been deleted',
            shardUID: Shard._id,
            shardId: Shard.id
        })
    })
}