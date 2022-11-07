//? Dependencies

import type { Request, Response } from 'express'

import { Collection } from '@lib/mongodb'

import ShardManager from '@lib/classes/shard'



//? Endpoint

export default async function (req: Request, res: Response) {

    const Shard = new ShardManager(req.headers.community as string, req.headers.shard as string)
    await Shard.fetch()

    const Plugins = await Collection('plugins')
    const Mods = await Collection('mods')



    const Packet = {
        ...Shard
    }


    return res.status(200).json({ data: Packet })

}