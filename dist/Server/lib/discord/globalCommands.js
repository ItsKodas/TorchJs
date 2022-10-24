"use strict";
//? Dependencies
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var servers = [
    {
        name: 'PuffyKinkyLand',
        value: 'puffy'
    },
    {
        name: 'BluKats Dream Land',
        value: 'blu'
    }
];
//? Commands
var Commands = [
    new discord_js_1.SlashCommandBuilder()
        .setName('manage')
        .setDescription('Manage Servers on the Network')
        .addSubcommandGroup(function (group) { return group.setName('world').setDescription('Manage Worlds on the Server')
        .addSubcommand(function (subcommand) { return subcommand.setName('create').setDescription('Create a new World')
        .addStringOption(function (option) { return option.setName('server').setDescription('Server to Manage').setRequired(true)
        .addChoices({ name: 'PuffyKinkyLand', value: 'puffy' }, { name: 'BluKats Dream Land', value: 'blu' }); })
        .addStringOption(function (option) { return option.setName('name').setDescription('Name of the World').setRequired(true); }); })
        .addSubcommand(function (subcommand) { return subcommand.setName('delete').setDescription('Delete a World')
        .addStringOption(function (option) { return option.setName('server').setDescription('Server to Manage').setRequired(true)
        .addChoices({ name: 'PuffyKinkyLand', value: 'puffy' }, { name: 'BluKats Dream Land', value: 'blu' }); })
        .addStringOption(function (option) { return option.setName('name').setDescription('Name of the World').setRequired(true); }); })
        .addSubcommand(function (subcommand) { return subcommand.setName('upload').setDescription('Upload a World to the Server (.zip)')
        .addStringOption(function (option) { return option.setName('server').setDescription('Server to Manage').setRequired(true)
        .addChoices({ name: 'PuffyKinkyLand', value: 'puffy' }, { name: 'BluKats Dream Land', value: 'blu' }); })
        .addStringOption(function (option) { return option.setName('name').setDescription('Name of the World').setRequired(true); })
        .addAttachmentOption(function (option) { return option.setName('file').setDescription('Compressed World File (.zip)').setRequired(true); }); }); })
];
exports.default = Commands;
