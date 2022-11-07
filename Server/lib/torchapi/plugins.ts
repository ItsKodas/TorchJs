//? Dependencies

import fs from 'fs'



//? Variables

let Plugins: any = null
let LastFetched: Date | null = null



//? Request Plugins from Torch API

export function Request(): Promise<any> {
    return new Promise(async (resolve, reject) => {

        const Now: Date = new Date()
        const Diff = LastFetched ? Now.getTime() - LastFetched.getTime() : null

        if (Diff && Diff < 1000 * 60 * 60 * 24) return resolve(Plugins)


        const Data = await fetch('https://torchapi.com/api/plugins')
            .then(res => {
                if (res.ok) {
                    LastFetched = new Date()
                    return res.json()
                }
                else console.log(res.json())
            })
            .catch(() => console.error('Failed to fetch plugins from Torch API!'))


        Plugins = Data.plugins
        resolve(Plugins)

    })
}

export default Request



//? Parse for Discord Choices

export const Choices = () => Request().then((Plugins: any) => Plugins.map((plugin: any) => ({ name: `${plugin.name} - ${plugin.author}`, value: plugin.id })))