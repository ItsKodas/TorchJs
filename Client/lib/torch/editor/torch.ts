//? Dependencies

import Config from '@lib/config'

import { ReadStream, WriteToFile } from '@lib/common/fileStream'

import Query from '@api/standard'



//? Prepare Torch Client for Startup

export default (client: TorchClient, shard: Shard, plugins: PluginPackPlugin[]) => {
    return new Promise(async (resolve, reject) => {

        const TorchConfig: any = await ReadStream(`${Config.torch.directory}/Torch.cfg`).catch(reject)



        TorchConfig.TorchConfig.Plugins = [{ guid: plugins.map((plugin: any) => plugin.guid) }]


        TorchConfig.TorchConfig.InstanceName = [shard.id]
        TorchConfig.TorchConfig.InstancePath = [client.instance.directory]
        TorchConfig.TorchConfig.Autostart = ['true']
        TorchConfig.TorchConfig.RestartOnCrash = ['false']
        TorchConfig.TorchConfig.NoGui = ['true']



        WriteToFile(`${Config.torch.directory}/Torch.cfg`, TorchConfig)
            .then(resolve)
            .catch(reject)

    })
}