//? Dependencies
import Client from '@lib/discord';
import { Collection } from '@lib/mongodb';
//? Exports
export default function DiscoverGuilds() {
    return new Promise(async (resolve, reject) => {
        const client = await Client();
        const Guilds = await client.guilds.fetch();
        const Communities = await Collection('communities');
        Guilds.forEach(guild => {
            const data = {
                id: guild.id,
                name: guild.name,
                icon: guild.iconURL({ size: 256, forceStatic: true })
            };
            Communities.updateOne({ id: data.id }, { $set: data }, { upsert: true });
        });
        resolve(`Discovered ${Guilds.size} Guilds!`);
    });
}
export function UpdateGuild(guild) {
    return new Promise(async (resolve, reject) => {
        const Communities = await Collection('communities');
        const data = {
            id: guild.id,
            name: guild.name,
            icon: guild.iconURL({ size: 256, forceStatic: true })
        };
        await Communities.updateOne({ id: data.id }, { $set: data }, { upsert: true })
            .then(() => console.info(`Added Guild "${data.id}"`))
            .catch(console.error);
        resolve(data);
    });
}
export async function DeleteGuild(guildId) {
    const Communities = await Collection('communities');
    Communities.deleteOne({ id: guildId })
        .then(() => console.warn(`Deleted Guild "${guildId}"`))
        .catch(console.error);
}
