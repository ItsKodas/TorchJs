//? Dependencies

import Config from '@lib/config'

import { ReadStream, WriteToFile } from '@lib/common/fileStream'

import Query from '@api/standard'



//? Prepare Torch Client for Startup

export default (client: TorchClient, shard: Shard) => {
    return new Promise(async (resolve, reject) => {

        const DedicatedConfig: any = await ReadStream(`${client.instance.directory}/SpaceEngineers-Dedicated.cfg`).catch(reject)


        // console.log(DedicatedConfig.MyConfigDedicated.SessionSettings)


        //! Server Settings

        DedicatedConfig.MyConfigDedicated.ServerName = [shard.settings.servername]
        DedicatedConfig.MyConfigDedicated.WorldName = [shard.settings.worldname]

        DedicatedConfig.MyConfigDedicated.ServerPort = [shard.settings.port]

        DedicatedConfig.MyConfigDedicated.LoadWorld = [`${client.instance.directory}/Saves/${shard.settings.world}`]



        //? Defaults

        DedicatedConfig.MyConfigDedicated.IgnoreLastSession = ['true']




        
        //! Session Settings

        // DedicatedConfig.MyConfigDedicated.SessionSettings[0].GameMode = ['']
        DedicatedConfig.MyConfigDedicated.SessionSettings[0].MaxPlayers = [shard.settings.maxplayers]



        //? Defaults

        DedicatedConfig.MyConfigDedicated.SessionSettings[0].OnlineMode = ['ONLINE']





        WriteToFile(`${client.instance.directory}/SpaceEngineers-Dedicated.cfg`, DedicatedConfig)
            .then(resolve)
            .catch(reject)

    })
}