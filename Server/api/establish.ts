//? Dependencies

import type { Request, Response } from 'express'

import { Collection } from '@lib/mongodb'
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'

import Alert from '@lib/discord/alert'



//? Endpoint

export default async function (req: Request, res: Response) {

    const _shard = req.headers.shard


    const Shards = await Collection('shards')
    const Shard = await Shards.findOne({ id: _shard })

    if (!Shard) {
        Alert(req.headers.community as string, [ShardRegisterEmbed(_shard as string, req.ip as string)], [ShardRegisterComponents()])

        return res.status(404).json({ error: 'This Shard does not Exist, please register it via Discord' })
    }


    return res.json({ message: `Successfully Established a Connection with Shard '${Shard.id}'` })

}



//? Embeds

const ShardRegisterEmbed: any = (shard: string, ip: string) => new EmbedBuilder()
    .setTitle('Shard Registration')
    .setDescription(`A new Shard has been registered, please verify it's authenticity.`)
    .setFields([
        {
            name: 'Shard ID',
            value: `\`${shard}\``,
            inline: true
        },
        {
            name: 'Shard System IP',
            value: `\`${ip}\``,
            inline: true
        }
    ])



//? Components

const ShardRegisterComponents: any = () => new ActionRowBuilder()
    .setComponents([
        new ButtonBuilder()
            .setCustomId('shard.register')
            .setLabel('Register')
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId('shard.cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)
    ])