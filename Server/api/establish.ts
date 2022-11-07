//? Dependencies

import type { Request, Response } from 'express'

import ShardManager from '@lib/classes/shard'

import { Collection } from '@lib/mongodb'
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'

import Update_ServerRelated from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from '@lib/discord/alert'



//? Endpoint

export default async function (req: Request, res: Response) {

    const _shard = req.headers.shard as string
    const _community = req.headers.community as string


    try {

        const Shard = new ShardManager(_community, _shard)
        await Shard.fetch().catch(err => { throw new Error(err) })

        console.log(Shard)

    }

    catch (err) {
        res.status(400).json({ error: err })
        console.log(err)
    }

    // if (_shard.match(/[^a-z0-9 _()]/)) return res.status(400).json({ error: 'Shard ID must only contain lowercase letters, numbers, and underscores' })


    // const Shards = await Collection('shards')
    // const Shard = await Shards.findOne({ id: _shard, community: _community })

    // //? Register Shard in Database if it doesn't exist
    // if (!Shard) {
    //     const ShardData: Shard = {
    //         id: _shard as string,
    //         name: _shard as string,
    //         enabled: false,
    //         community: req.headers.community as string,
    //         status: {
    //             state: 'offline',
    //             heartbeat: new Date(),
    //             shouldBeRunning: false
    //         },
    //         settings: {
    //             servername: 'New Server',
    //             worldname: 'New World',
    //             port: 27015,
    //             maxplayers: 8,
    //             password: null,
    //             world: 'New World'
    //         }
    //     }

    //     const ShardId = await Shards.insertOne(ShardData)
    //         .then(document => {
    //             Update_ServerRelated(_community, 'servers')
    //             return document.insertedId
    //         })

    //     Alert(req.headers.community as string, true, [ShardRegisterEmbed(_shard as string, req.ip as string)], [ShardRegisterComponents(ShardId)])

    //     return res.status(404).json({ error: 'This Shard does not currently exist on our Database, please confirm it via Discord within the set "alerts" channel' })
    // }

    // if (!Shard.enabled) return res.status(401).json({ error: 'This Shard is currently disabled, please enable it via Discord' })


    // //? Update Shard Status
    // Shards.updateOne({ id: _shard, community: _community }, { $set: { 'status.state': 'online', 'status.heartbeat': new Date() } })


    // return res.status(200).json({ message: `Successfully Established a Connection with Shard '${Shard.id}'` })
}



//? Embeds

const ShardRegisterEmbed: any = (shard: string, ip: string) => new EmbedBuilder()
    .setTitle('Shard Registration Request')
    .setDescription(`A New Shard has been Registered, please confirm its creation to enable it.`)
    .setColor(Colors.warning)
    .setFields([
        {
            name: 'Shard Identifier',
            value: `\`${shard}\``,
            inline: true
        },
        {
            name: 'System Address',
            value: `\`${ip}\``,
            inline: true
        }
    ])



//? Components

const ShardRegisterComponents: any = (id: string) => new ActionRowBuilder()
    .setComponents([
        new ButtonBuilder()
            .setCustomId(`shard.register.${id}`)
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId(`shard.cancel.${id}`)
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
    ])