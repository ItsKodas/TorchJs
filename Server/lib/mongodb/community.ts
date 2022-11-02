//? Dependencies

import { Collection } from "."


//? Get Community

export default async (guild: string) => {

    const Communities = await Collection('communities')
    const Community = await Communities.findOne({ id: guild }) || null

    return Community as Community

}