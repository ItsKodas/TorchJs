//? Dependencies

import Config from '@lib/config'

import { ReadStream } from '@lib/common/fileStream'

import Query from '@api/standard'



//? Prepare Torch Client for Startup

export default (shard: Shard) => {
    return new Promise(async (resolve, reject) => {

        const Plugins = await Query('plugins').catch(reject)
        const TorchConfig: any = await ReadStream(`${Config.torch.directory}/Torch.cfg`).catch(reject)

        console.log(Plugins)
        
        TorchConfig.TorchConfig.InstanceName = [shard.id]


    })
}