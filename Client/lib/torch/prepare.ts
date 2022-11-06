//? Dependencies

import Config from '@lib/config'

import Bucket from '@api/bucket'

import { ReadStream } from '@lib/torch/fileStream'



//? Prepare Torch Client for Startup

export default () => {
    return new Promise(async (resolve, reject) => {

        const Data: any = (await Bucket().catch(reject) as any).data
        console.info(Data)



        //! Prep Torch.cfg

        const TorchConfig: any = await ReadStream(`${Config.torch.directory}/Torch.cfg`).catch(reject)

        console.log(TorchConfig)
        
        TorchConfig.TorchConfig.InstanceName = [Data.id]


    })
}