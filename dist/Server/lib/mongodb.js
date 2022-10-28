//? Dependencies
import Config from '@lib/config';
import { MongoClient } from 'mongodb';
//? Client
let _client;
export default function Client() {
    return new Promise(async (resolve, reject) => {
        if (!await _client?.db(Config.mongo.db).admin().ping()) {
            MongoClient.connect(Config.mongo.uri)
                .then(client => {
                _client = client;
                resolve(_client);
            })
                .catch(reject);
        }
        else
            resolve(_client);
    });
}
//? Common Functions
export function Collection(collection) {
    return new Promise((resolve, reject) => {
        Client()
            .then(client => resolve(client.db(Config.mongo.db).collection(collection)))
            .catch(() => reject('Failed to Communicate with the Database!'));
    });
}
