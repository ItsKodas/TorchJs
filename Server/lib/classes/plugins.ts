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


    /**
     * Constructs a new Plugin Package
     * 
     * @param guildId The Guild ID of the Community this Package Relates to
     * @param guid The GUID of the Package (if not provided, a new Package will be created when fetched)
     * 
     * @returns A new Plugin Package
     */
    constructor(guildId: string, guid?: string) {
        this._id = guid ? new ObjectId(guid) : new ObjectId()

        this.name = 'unknown'
        this.enabled = true
        this.community = guildId

        this.plugins = []
    }


    /**
     * Fetches a Package from the Database matching the guildId and guid
     * 
     * @returns Whether or not the Package was successfully fetched from the database (Updates this Class with the fetched data)
     */
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

    /**
     * Saves / Updates the Package on the database
     * 
     * @returns Whether or not the Plugin Package was successfully saved / updated on the database (Uses the data present in this Class)
     */
    save(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Packs = await Collection('plugins')

            const isNew = await Packs.findOne({ _id: this._id }).then(pack => pack ? true : false).catch(err => { console.error(err); return true })
            if (isNew && await (await Packs.find({ community: this.community }).toArray()).length >= 25) return reject('Maximum Quantity of Plugin Packages has been reached for this Community! (25)')


            Packs.updateOne({ _id: this._id }, { $set: this }, { upsert: true })
                .then(res => {
                    if (!res.acknowledged) return reject('Plugin Package failed to save to the database!')
                    return resolve('Plugin Package successfully saved to the database!')
                })
                .catch(reject)

        })
    }

    /**
     * Deletes this Package from the database
     * 
     * @requires The Package to be fetched from the database first
     * 
     * @returns Whether or not the Package was successfully deleted
     */
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


    /**
     * Adds a Plugin to this Package
     * 
     * @param plugin
     * 
     * @returns Whether or not the Plugin was successfully added
     */
    add(plugin: PluginPackPlugin): Promise<string> {
        return new Promise(async (resolve, reject) => {

            if (this.plugins.find(p => p.guid == plugin.guid)) return reject('Plugin already exists in this Package!')

            this.plugins.push(plugin)

            this.save()
                .then(resolve)
                .catch(reject)

        })
    }


    /**
     * Removes a Plugin from this Package
     * 
     * @param identifier This can either be the index of the Plugin in the Package, or the GUID of the Plugin
     * 
     * @returns Whether or not the Plugin was successfully removed
     */
    remove(identifier: string | number): Promise<PluginPackPlugin> {
        return new Promise(async (resolve, reject) => {

            let plugin: PluginPackPlugin = {} as PluginPackPlugin


            if (typeof identifier == 'string') this.plugins.find((plugin, index) => {
                if (plugin.guid == identifier) plugin = this.plugins.splice(index, 1)[0]
            })

            if (typeof identifier == 'number') plugin = this.plugins.splice(identifier, 1)[0]


            if (!plugin) return reject('Plugin could not be found!')


            this.save()
                .then(() => resolve(plugin))
                .catch(reject)

        })
    }

}