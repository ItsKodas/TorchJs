//? Dependencies

import { Collection } from "@lib/mongodb"



//? Request and Sync Plugins from Torch API

export async function Sync() {

    const Data = await fetch('https://torchapi.com/api/plugins')
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            else console.log(res.json())
        })
        .catch(() => console.error('Failed to fetch plugins from Torch API!'))

    if (!Data) return


    const Plugins = await Collection('torchapi-plugins')

    Data.plugins.forEach((plugin: any) => {
        Plugins.updateOne(
            { _id: plugin.id },
            { $set: plugin },
            { upsert: true }
        )    
    })

    console.log(`Successfully synced ${Data.plugins.length} plugins from Torch API!`)

}

export default Sync