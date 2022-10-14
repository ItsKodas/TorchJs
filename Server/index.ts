import { Guild } from "@lib/discord"


Guild('610606066451087370').then(guild => {
    console.log(guild.memberCount)
})