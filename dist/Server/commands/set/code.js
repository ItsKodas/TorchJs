//? Dependencies
import { Collection } from "@lib/mongodb";
import { UpdateGuild } from '@lib/discord/guildUpdates';
//? Command
export default async (interaction) => {
    const Code = interaction.options.getString('code');
    const Communities = await Collection('communities');
    const Community = await Communities.findOne({ id: interaction.guildId }) || await UpdateGuild(interaction.guild);
    Communities.updateOne({ id: Community.id }, { $set: { ...Community, code: Code } }, { upsert: true })
        .then(() => interaction.reply({ content: `Community Security Code has been successfully set to: \`${Code}\``, ephemeral: true }))
        .catch(() => interaction.reply({ content: 'An error occurred while setting the Community Security Code', ephemeral: true }));
};
