//? Dependencies

import { Request, Response, NextFunction } from "express"

import { Collection } from "@lib/mongodb"

import Hash from "@lib/security/hash"
import GetCommunity from "@lib/mongodb/community"



//? Middleware

export default async function (req: Request, res: Response, next: NextFunction) {

    const { community, password, shard } = req.headers

    if (!community) return res.status(400).json({ error: 'Missing community header!' })
    if (!password) return res.status(400).json({ error: 'Missing password header!' })
    if (!shard) return res.status(400).json({ error: 'Missing shard header!' })


    const Community = await GetCommunity(community as string)
    if (!Community) return res.status(404).json({ error: `The Community with the ID '${community}' could not be found on our Database.` })

    if (Hash(password as string, Community.password?.salt).hash != Community.password?.hash) return res.status(401).json({ error: 'The Password you provided is incorrect!' })

    const Shards = await Collection('shards')
    await Shards.updateOne({ community, id: shard }, { $set: { 'status.state': 'online', 'status.heartbeat': new Date() } })


    next()

}