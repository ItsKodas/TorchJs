//? Dependencies

import { Request, Response, NextFunction } from "express"

import { Collection } from "@lib/mongodb"

import CommunityManager from "@lib/classes/community"
import ShardManager from "@lib/classes/shard"



//? Middleware

export default async function (req: Request, res: Response, next: NextFunction) {

    const { community, password, shard } = req.headers

    if (!community) return res.status(400).json({ error: 'Missing community header!' })
    if (!password) return res.status(400).json({ error: 'Missing password header!' })
    if (!shard) return res.status(400).json({ error: 'Missing shard header!' })


    const Community = new CommunityManager(community as string)
    if (!await Community.fetch().catch(() => false)) return res.status(404).json({ error: "This Discord Guild does not exist on our Database, please make sure you have added the Discord Bot to your Guild." })

    if (!await Community.verifyPassword(password as string).catch(() => false)) return res.status(401).json({ error: 'The Password you provided is incorrect!' })



    //! Shard Checking & Heartbeat

    const Shard = new ShardManager(community as string, shard as string)
    if (!await Shard.fetch().catch(() => false)) return res.status(404).json({ error: 'This Shard ID has not been registered to our Database, please register it via Discord using "/server register"' })
    if (!Shard.enabled) return res.status(400).json({ error: 'This Shard is currently disabled! Please enable it via Discord using "/server enable"' })

    Shard.status.state = 'online'
    Shard.status.heartbeat = new Date()

    await Shard.save()
        .then(() => next())
        .catch(() => res.status(500).json({ error: 'An error occurred while syncing this Shard!' }))

}