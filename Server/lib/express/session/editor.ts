//? Dependencies

import type { Request, Response } from 'express'

import app from '@lib/express'

import ConfigManager from '@lib/classes/configuration'

import Formidable from 'formidable'



//? Variables

const Form = Formidable({ multiples: true })



//? Get

export const get = async (req: Request, res: Response) => {

    const DocumentId = req.query.id as string
    const SessionId = req.query.session as string
    if (!DocumentId || !SessionId) return res.status(400).json({ error: 'No ID / Session ID provided!' })


    const Configuration = new ConfigManager('0', null, DocumentId)
    if (!await Configuration.fetch().catch(() => false)) return res.status(404).json({ error: 'Configuration could not be found!' })


    if (Configuration.session?.id != SessionId) return res.status(403).json({ error: 'Session ID is invalid!' })

    if (req.query.raw) return res.status(200).json({ data: Configuration.session.data || Configuration.data || 'This File is Empty.' })



    const props = {
        title: `Editor | ${Configuration.name}`,
        description: 'Configuration Editor Session is active!',
        component: 'editor'
    }

    res.render('document', props)

}



//? Save

export const save = async (req: Request, res: Response) => {

    const DocumentId = req.query.id as string
    const SessionId = req.query.session as string
    if (!DocumentId || !SessionId) return res.status(400).json({ error: 'No ID / Session ID provided!' })


    const Configuration = new ConfigManager('0', null, DocumentId)
    if (!await Configuration.fetch().catch(() => false)) return res.status(404).json({ error: 'Configuration could not be found!' })


    if (Configuration.session?.id != SessionId) return res.status(403).json({ error: 'Session ID is invalid!' })


    Form.parse(req, async (err, fields) => {
        if (err) return res.status(400).send('Invalid request body!')

        if (!Configuration.session) return res.status(500).json({ error: 'Session is not active!' })

        const Data = fields.data as string

        Configuration.session.data = Data
        Configuration.session.lastUpdated = new Date()
        Configuration.save().then(() => res.status(200).json({status: 'OK'})).catch((err) => res.status(500).json({ error: err }))
    })

}



//? Publish

export const publish = async (req: Request, res: Response) => {

    const DocumentId = req.query.id as string
    const SessionId = req.query.session as string
    if (!DocumentId || !SessionId) return res.status(400).json({ error: 'No ID / Session ID provided!' })


    const Configuration = new ConfigManager('0', null, DocumentId)
    if (!await Configuration.fetch().catch(() => false)) return res.status(404).json({ error: 'Configuration could not be found!' })


    if (Configuration.session?.id != SessionId) return res.status(403).json({ error: 'Session ID is invalid!' })


    Form.parse(req, async (err, fields) => {
        if (err) return res.status(400).send('Invalid request body!')

        if (!Configuration.session) return res.status(500).json({ error: 'Session is not active!' })

        const Data = fields.data as string
        if (!Data) return res.status(400).json({ error: 'No data provided!' })

        Configuration.data = Data
        Configuration.session = null
        Configuration.save().then(() => res.status(200).json({status: 'OK'})).catch((err) => res.status(500).json({ error: err }))
    })

}



//? Delete

export const discard = async (req: Request, res: Response) => {

    const DocumentId = req.query.id as string
    const SessionId = req.query.session as string
    if (!DocumentId || !SessionId) return res.status(400).json({ error: 'No ID / Session ID provided!' })


    const Configuration = new ConfigManager('0', null, DocumentId)
    if (!await Configuration.fetch().catch(() => false)) return res.status(404).json({ error: 'Configuration could not be found!' })


    if (Configuration.session?.id != SessionId) return res.status(403).json({ error: 'Session ID is invalid!' })


    Configuration.session = null
    Configuration.save().then(() => res.status(200).json({status: 'OK'})).catch((err) => res.status(500).json({ error: err }))

}



//? Delete

export const notify = async (req: Request, res: Response) => {

    const DocumentId = req.query.id as string
    const SessionId = req.query.session as string
    if (!DocumentId || !SessionId) return res.status(400).json({ error: 'No ID / Session ID provided!' })


    const Configuration = new ConfigManager('0', null, DocumentId)
    if (!await Configuration.fetch().catch(() => false)) return res.status(404).json({ error: 'Configuration could not be found!' })


    if (Configuration.session?.id != SessionId) return res.status(403).json({ error: 'Session ID is invalid!' })


    Configuration.session.lastUpdated = new Date()
    Configuration.save().then(() => res.status(200).json({status: 'OK'})).catch((err) => res.status(500).json({ error: err }))

}