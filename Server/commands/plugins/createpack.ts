//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import PluginManager from "@lib/classes/plugins"

import Update_Commands from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const Pack = new PluginManager(interaction.guildId as string)

    Pack.name = interaction.options.getString('name', true)

    Pack.save()
        .then(() => {
            interaction.reply({ content: `Created New Plugin Pack: **${Pack.name}** - \`${Pack._id}\``, ephemeral: true })

            Alert(interaction.guildId as string, false, [
                new EmbedBuilder()
                    .setTitle(`New Plugin Pack Created: __${Pack.name}__`)
                    .setDescription(`New Plugin Pack has been created by ${interaction.user}`)
                    .setFooter({ text: `GUID: ${Pack._id}` })
                    .setColor(Colors.success)
            ])

            Update_Commands(interaction.guildId as string, ['plugins'])
                .then(res => console.log(res))
                .catch(console.error)
        })
        .catch(error => {
            console.error(error)
            interaction.reply({ content: `An error occurred while creating the Plugin Pack\n\n**Details**\n\`${error}\``, ephemeral: true })
        })
}