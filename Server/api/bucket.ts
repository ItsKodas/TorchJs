//? Dependencies

import type { Request, Response } from 'express'

import { Collection } from '@lib/mongodb'



//? Endpoint

export default async function (req: Request, res: Response) {

    const _shard = req.headers.shard as string
    const _community = req.headers.community as string


    const Shards = await Collection('shards')
    const Shard = await Shards.findOne({ id: _shard, community: _community }) as Shard

    const Plugins = await Collection('plugins')
    const Mods = await Collection('mods')



    const Packet = {
        ...Shard
    }


    return res.status(200).json({ data: Packet })

}