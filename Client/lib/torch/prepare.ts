//? Dependencies

import Config from '@lib/config'

import Query from '@api/standard'

import Edit_Torch from '@lib/torch/editor/torch'



//? Prepare Torch Client for Startup

export default () => {
    return new Promise(async (resolve, reject) => {

        const Data: Shard = (await Query('shard').catch(reject) as any).data
        console.info(Data)


        await Edit_Torch(Data).catch(err => console.error(err))


    })
}