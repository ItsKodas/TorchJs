//? Dependencies

import Config from '@lib/config'

import Query from '@api/standard'

import Edit_Torch from '@lib/torch/editor/torch'
import Edit_Dedicated from '@lib/torch/editor/dedicated'



//? Prepare Torch Client for Startup

export default (client: TorchClient) => {
    return new Promise(async (resolve, reject) => {

        const Shard: Shard = (await Query(client.id, 'shard').catch(reject) as any).data
        const Plugins: PluginPackPlugin[] = (await Query(client.id, 'plugins').catch(reject) as any).data


        await Edit_Torch(client, Shard, Plugins).then(res => console.info(res)).catch(reject)
        await Edit_Dedicated(client, Shard).then(res => console.info(res)).catch(reject)



        resolve(`Client ${client.id} is Prepped for Startup!`)

    })
}