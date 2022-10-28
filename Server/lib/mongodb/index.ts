//? Dependencies

import Config from '@lib/config'
import { MongoClient, Collection as MongoCollection } from 'mongodb'


//? Client

let _client: MongoClient

export default function Client(): Promise<MongoClient> {
    return new Promise(async (resolve, reject) => {

        if (!await _client?.db(Config.mongo.db).admin().ping()) {
            MongoClient.connect(Config.mongo.uri)
                .then(client => {
                    _client = client
                    resolve(_client)
                })
                .catch(reject)
        } else resolve(_client)

    })
}


//? Common Functions

export function Collection(collection: 'communities' | 'mods' | 'plugins' | 'servers' | 'worlds'): Promise<MongoCollection> {
    return new Promise((resolve, reject) => {
        Client()
            .then(client => resolve(client.db(Config.mongo.db).collection(collection)))
            .catch(() => reject('Failed to Communicate with the Database!'))
    })
}