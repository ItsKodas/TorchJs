//? Dependencies

import { ButtonInteraction, CacheType, EmbedBuilder } from "discord.js"

import { Enable } from '@lib/mongodb/shard'

import * as Colors from '@lib/discord/colors'



//? Command

export default (interaction: ButtonInteraction<CacheType>, args: string[]) => {

    Enable(interaction.guildId as string, args[2])
        .then((res: any) => {
            interaction.update({
                content: '',
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Shard Registration Confirmed')
                        .setDescription(res.message)
                        .setAuthor({ name: interaction.user.tag })
                        .setColor(Colors.success)
                        .setFields([
                            { name: 'Shard Identifier', value: res.shardId }
                        ])
                ], components: []
            })
        })
        .catch(err => {
            interaction.reply({ content: err, ephemeral: true })
            interaction.message.delete()
        })

}