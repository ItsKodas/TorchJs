//? Dependencies

import type { Request, Response } from 'express'

import app from '@lib/express'

import ConfigManager from '@lib/classes/configuration'



//? Get

export const get = async (req: Request, res: Response) => {

    const DocumentId = req.query.id as string
    const SessionId = req.query.session as string
    if (!DocumentId || !SessionId) return res.status(400).send('No ID / Session ID provided!')


    const Configuration = new ConfigManager('0', null, DocumentId)
    if (!await Configuration.fetch().catch(() => false)) return res.status(404).send('Configuration could not be found!')


    if (Configuration.session?.id != SessionId) return res.status(403).send('Session ID is invalid!')

    

    const props = {
        title: `Editor | ${Configuration.name}`,
        description: 'Configuration Editor Session is active!',
        component: 'editor',

        data: Configuration.data
    }

    res.render('document', props)

}



//? Post

export const post = async (req: Request, res: Response) => {

}