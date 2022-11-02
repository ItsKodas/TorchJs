//? Dependencies

import { Collection } from "@lib/mongodb"

import type { ObjectId, Filter, Document } from 'mongodb'



//? Variables

let Connected: any = {}
export default Connected



//? Cycle Shards

export const CycleShards = async () => {
    const Shards = await Collection('shards')
    const ShardList = await Shards.find({}, { projection: { _id: 1 } }).toArray() as Shard[]

    ShardList.forEach(async Shard => Heartbeat({ _id: Shard._id }))
}



//? Shard Heartbeat

export const Heartbeat = async (filter: Filter<Document>) => {
    const Shards = await Collection('shards')
    const Shard = await Shards.findOne(filter, { projection: { _id: 1, status: 1 } }) as Shard
    if (!Shard) return


    const now = new Date()
    const last = new Date(Shard.status.heartbeat)
    const diff = (now.getTime() - last.getTime()) / 1000

    if (Shard.status.state != 'offline' && diff > 60 * 5) Shards.updateOne({ _id: Shard._id }, { $set: { 'status.state': 'offline' } }), console.warn(`${Shard._id} has been marked as offline (${diff} seconds since last ping)`)

}