//? Dependencies

import type { Request, Response } from 'express'

import ShardManager from '@lib/classes/shard'
import PluginManager from '@lib/classes/plugins'



//? Endpoint

export default async function (req: Request, res: Response) {

    const Shard = new ShardManager(req.headers.community as string, req.headers.shard as string)
    await Shard.fetch()


    let Plugins: any[] = []
    for (const pack of Shard.plugins) {
        const Pack = new PluginManager(Shard.community, pack.guid)
        if (!await Pack.fetch().catch(() => false)) return Pack.delete()

        for (const plugin of Pack.plugins) {
            if (Plugins.findIndex(p => p.guid == plugin.guid) == -1) Plugins.push(plugin)
        }
    }

    
    return res.status(200).json({ data: Plugins })

}