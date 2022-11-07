//? Dependencies

import { randomBytes, pbkdf2Sync } from 'crypto'

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'



//? Class Definitions

export default class PluginManager implements PluginPack {
    _id: ObjectId

    name: string
    enabled: boolean
    community: string

    plugins: PluginPackPlugin[]


    constructor(guildId: string, guid?: string) {
        this._id = guid ? new ObjectId(guid) : new ObjectId()

        this.name = 'unknown'
        this.enabled = true
        this.community = guildId

        this.plugins = []
    }



    fetch(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Packs = await Collection('plugins')
            const Pack = await Packs.findOne({ _id: this._id }) as PluginPack
            if (!Pack) return reject('Plugin Package could not be found!')


            this.name = Pack.name
            this.enabled = Pack.enabled
            this.community = Pack.community

            this.plugins = Pack.plugins


            return resolve('Plugin Package successfully fetched from database!')

        })
    }

    save(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Packs = await Collection('plugins')

            Packs.updateOne({ _id: this._id }, { $set: this }, { upsert: true })
                .then(res => {
                    if (!res.acknowledged) return reject('Plugin Package failed to save to the database!')
                    return resolve('Plugin Package successfully saved to the database!')
                })
                .catch(reject)

        })
    }

    delete(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Packs = await Collection('plugins')

            Packs.deleteOne({ _id: this._id })
                .then(res => {
                    if (!res.acknowledged) return reject('Failed to delete Plugin Package! (No Acknowledgement, Shard may not exist)')
                    return resolve('Plugin Package successfully deleted from the database!')
                })
                .catch(reject)

        })
    }


    add(plugin: PluginPackPlugin): Promise<string> {
        return new Promise(async (resolve, reject) => {

            if (this.plugins.find(p => p.guid == plugin.guid)) return reject('Plugin already exists in this Package!')

            this.plugins.push(plugin)

            this.save()
                .then(resolve)
                .catch(reject)

        })
    }

    remove(guid: string): Promise<string> {
        return new Promise(async (resolve, reject) => {

            this.plugins.find((plugin, index) => {
                if (plugin.guid == guid) this.plugins.splice(index, 1)
            })

            this.save()
                .then(resolve)
                .catch(reject)

        })
    }

}