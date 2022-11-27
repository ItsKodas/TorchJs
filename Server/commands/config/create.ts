//? Dependencies

import Discord from "discord.js"

import { Collection } from '@lib/mongodb'

import ConfigManager from "@lib/classes/configuration"

import * as Autocomplete from "@lib/common/autocomplete"

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create a New Configuration')

    .addStringOption(option => option
        .setName('name')
        .setDescription('Display Name of the Configuration to help you identify it')
        .setRequired(true)
    )

    .addStringOption(option => option
        .setName('type')
        .setDescription('The type of Configuration (Affects its usage on the Server)')
        .setRequired(true)
        .setChoices(
            { name: 'Sandbox Configuration (Essential Server Configurations)', value: 'server' },
            { name: 'Plugin Configuration (Custom Configuration for Plugins)', value: 'plugin' },
            { name: 'Instance Mod Configuration (Mod Configuration used in the Instance Storage Folder)', value: 'instance' },
            { name: 'World Mod Configuration (Mod Configuration used in the Worlds Storage Folder)', value: 'world' }
        )
    )

    .addStringOption(option => option
        .setName('filename')
        .setDescription('Set the File Name to be used on the System (Not Required for Sandbox Configurations)')
        .setRequired(false)
        .setMinLength(1)
        .setMaxLength(60)
    )

    .addStringOption(option => option
        .setName('foldername')
        .setDescription('Set the Folder Name to be used on the System (Only Required for Instance and World Configurations)')
        .setRequired(false)
        .setMinLength(1)
        .setMaxLength(60)
    )


//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Name = interaction.options.getString('name', true)
    const Type = interaction.options.getString('type', true) as ConfigPreset['type']


    const Config = new ConfigManager(interaction.guildId as string, Type)

    Config.name = Name


    if (Type == 'server') {

    }

    if (Type == 'plugin') {
        if (!interaction.options.getString('filename')) return interaction.reply({ content: 'You must provide a File Name for Plugin Configurations', ephemeral: true })

        Config.type = 'plugin'
        Config.file = interaction.options.getString('filename')
    }

    if (Type == 'instance') {
        if (!interaction.options.getString('filename')) return interaction.reply({ content: 'You must provide a File Name for Instance Configurations', ephemeral: true })

        Config.type = 'instance'
        Config.file = interaction.options.getString('foldername') ? `${interaction.options.getString('foldername')}/${interaction.options.getString('filename')}` : interaction.options.getString('filename')
    }

    if (Type == 'world') {
        if (!interaction.options.getString('filename')) return interaction.reply({ content: 'You must provide a File Name for Instance Configurations', ephemeral: true })

        Config.type = 'world'
        Config.file = interaction.options.getString('foldername') ? `${interaction.options.getString('foldername')}/${interaction.options.getString('filename')}` : interaction.options.getString('filename')
    }


    Config.save()
        .then(() => interaction.reply({ content: `Successfully created a new ${Type} Configuration!`, ephemeral: true }))
        .catch(() => interaction.reply({ content: `Failed to create a new ${Type} Configuration!`, ephemeral: true }))

}