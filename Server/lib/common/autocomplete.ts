//? Dependencies

import { Collection } from "@lib/mongodb"



//? Shards

export const Shards = async (community: string, search: string, filter?: 'enabled' | 'disabled') => {

    let Filter: any = {}

    if (filter == 'enabled') Filter = { enabled: true }
    if (filter == 'disabled') Filter = { enabled: false }

    const Shards = await (await Collection('shards')).find({ ...Filter, community, $or: [{ id: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }] }, { limit: 25, projection: { id: 1, name: 1 } }).toArray().catch(() => []) as Shard[]

    return Shards.map(choice => ({ name: `${choice.name} (${choice.id})`, value: choice.id }))

}


//? Shards

export const PluginPacks = async (community: string, search: string, filter?: 'enabled' | 'disabled') => {

    // let Filter: any = {}

    // if (filter == 'enabled') Filter = { enabled: true }
    // if (filter == 'disabled') Filter = { enabled: false }

    const Plugins = await (await Collection('plugins')).find(
        {
            community,
            $or: [
                { _id: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ]
        },
        {
            limit: 25,
            projection: { _id: 1, name: 1 }
        }).toArray().catch(() => []) as PluginPack[]

    return Plugins.map(choice => ({ name: `${choice.name} | ${choice._id.toString()}`, value: choice._id.toString() }))

}


//? TorchAPI Plugins

export const TorchAPIPlugins = async (search: string) => {

    const Plugins = await (await Collection('torchapi-plugins')).find(
        {
            $or: [
                { id: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ]
        },
        {
            limit: 25,
            projection: { id: 1, name: 1, author: 1, downloads: 1 },
            sort: { downloads: -1 }
        }
    ).toArray().catch(() => []) as any[]

    return Plugins.map((choice: any) => ({ name: `${choice.name} by ${choice.author} (${choice.downloads} downloads)`, value: choice.id }))

}


//? Configurations

export const Configurations = async (community: string, search: string) => {

    const Configurations = await (await Collection('configs')).find({ community, $or: [{ _id: { $regex: search, $options: 'i' } }, { name: { $regex: search, $options: 'i' } }] }, { limit: 25, projection: { _id: 1, name: 1 } }).toArray().catch(() => []) as ConfigPreset[]

    return Configurations.map(choice => ({ name: `${choice.name} (${choice._id.toString()})`, value: choice._id.toString() }))

}