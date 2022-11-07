//? Dependencies

import { Collection } from "@lib/mongodb"

import ShardManager from '@lib/classes/shard'



//? Variables

let Connected: any = {}
export default Connected



//? Cycle Shards

export const CycleShards = async () => {
    const Shards = await Collection('shards')
    const ShardList = await Shards.find({}, { projection: { community: 1, id: 1 } }).toArray() as Shard[]

    ShardList.forEach(async Shard => Heartbeat(Shard.community, Shard.id))
}



//? Shard Heartbeat

export const Heartbeat = async (guildId: string, shardId: string) => {

    const Shard = new ShardManager(guildId, shardId)
    if (!await Shard.fetch().catch(() => false)) return

    
    const now = new Date()
    const last = new Date(Shard.status.heartbeat)
    const diff = (now.getTime() - last.getTime()) / 1000

    if (Shard.status.state != 'offline' && diff > 60 * 5) {
        Shard.status.state = 'offline'
        Shard.save()
            .then(() => console.warn(`${Shard._id} has been marked as offline (${diff} seconds since last ping)`))
            .catch(console.error)
    }

}