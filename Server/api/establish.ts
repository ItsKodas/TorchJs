//? Dependencies

import type { Request, Response } from 'express'

import ShardManager from '@lib/classes/shard'

import { Collection } from '@lib/mongodb'
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'

import * as Colors from '@lib/discord/colors'
import Alert from '@lib/discord/alert'



//? Endpoint

export default async function (req: Request, res: Response) {

    const Shard = new ShardManager(req.headers.community as string, req.headers.shard as string)
    await Shard.fetch()

    return res.status(200).json({ message: `Successfully Established a Connection with Shard '${Shard.id}'` })

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