//? Dependencies

import Discord from "discord.js"

import PluginManager from "@lib/classes/plugins"

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('createpack')
    .setDescription('Create a New Plugin Package to link to your servers')
    .addStringOption(option => option
        .setName('name')
        .setDescription('Name of the Plugin Package to Create')
        .setRequired(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Pack = new PluginManager(interaction.guildId as string)

    Pack.name = interaction.options.getString('name', true)

    Pack.save()
        .then(() => {
            interaction.reply({ content: `Created New Plugin Pack: **${Pack.name}** - \`${Pack._id}\``, ephemeral: true })

            Alert(interaction.guildId as string, false, [
                new Discord.EmbedBuilder()
                    .setTitle(`New Plugin Pack Created: __${Pack.name}__`)
                    .setDescription(`New Plugin Pack has been created by ${interaction.user}`)
                    .setFooter({ text: `GUID: ${Pack._id}` })
                    .setColor(Colors.success)
            ])

        })
        .catch(error => {
            console.error(error)
            interaction.reply({ content: `An error occurred while creating the Plugin Pack\n\n**Details**\n\`${error}\``, ephemeral: true })
        })
}