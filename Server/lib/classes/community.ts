//? Dependencies

import { randomBytes, pbkdf2Sync } from 'crypto'

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'



//? Class Definitions

export default class CommunityManager implements Community {
    _id: ObjectId

    id: string
    name: string
    icon: string | null

    password?: CommunityPassword
    alerts?: CommunityAlerts


    constructor(guildId: string) {
        this._id = new ObjectId()

        this.id = guildId
        this.name = 'unknown'
        this.icon = 'unknown'
    }



    fetch(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Communities = await Collection('communities')
            const Community = (await Communities.findOne({ _id: this._id }) || await Communities.findOne({ id: this.id })) as Community
            if (!Community) return reject('Community could not be found!')


            this._id = Community._id
            this.name = Community.name
            this.icon = Community.icon

            if (Community.password) this.password = Community.password
            if (Community.alerts) this.alerts = Community.alerts


            return resolve('Community successfully fetched from database!')

        })
    }

    save(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Communities = await Collection('communities')

            Communities.updateOne({ _id: this._id }, { $set: this }, { upsert: true })
                .then(res => {
                    if (!res.acknowledged) return reject('Community failed to save to the database!')
                    return resolve('Community successfully saved to the database!')
                })
                .catch(reject)

        })
    }

    delete(): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Communities = await Collection('communities')

            Communities.deleteOne({ _id: this._id })
                .then(res => {
                    if (!res.acknowledged) return reject('Failed to delete Community! (No Acknowledgement, Shard may not exist)')
                    return resolve('Community successfully deleted from the database!')
                })
                .catch(reject)

        })
    }


    setPassword(password: string): Promise<string> {
        return new Promise(async (resolve, reject) => {

            const Salt = randomBytes(16).toString('hex')
            const Hash = pbkdf2Sync(password, Salt, 10000, 64, 'sha256').toString('hex')

            this.password = {
                salt: Salt,
                hash: Hash
            }

            this.save()
                .then(resolve)
                .catch(reject)

        })
    }

    verifyPassword(password: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {

            if (!this.password) return reject('Community does not have a password set!')

            const Hash = pbkdf2Sync(password, this.password.salt, 10000, 64, 'sha256').toString('hex')

            return resolve(Hash === this.password.hash)

        })
    }
}