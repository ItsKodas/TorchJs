//? Dependencies

import type { Request, Response } from 'express'

import { Collection } from '@lib/mongodb'



//? Endpoint

export default async function (req: Request, res: Response) {

    const _shard = req.headers.shard as string
    const _community = req.headers.community as string


    const Shards = await Collection('shards')
    const Shard = await Shards.findOne({ id: _shard, community: _community })
    if (!Shard) return res.status(404).json({ error: 'This Server does not currently exist on our Database' })

    

}