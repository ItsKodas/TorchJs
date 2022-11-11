//? Dependencies

import app from '.'

import { randomBytes } from 'crypto'

import type { IRoute } from 'express'



//? Class

export default class Page {

    uid: string

    title: string
    description: string

    path: string
    component: string


    constructor(title?: string, description?: string, path?: string, component?: string) {

        this.uid = randomBytes(16).toString('base64url')

        this.title = title || 'Untitled'
        this.description = description || 'No description provided'

        this.path = path || 'temp'
        this.component = component || 'error'

    }


    initialize() {

        app.route(`/${this.path}/${this.uid}`)
            .get((req, res) => {

                const data = {
                    title: this.title,
                    description: this.description,
                    component: this.component
                }

                res.render('document', data)

                this.delete()

            })
            .post((req, res) => {
                console.log(req.body)
                res.status(200).send('OK')
            })

    }


    delete() {
        const Route = app._router.stack.findIndex((route: IRoute) => route.path == `/${this.path}/${this.uid}`)
        app._router.stack.splice(Route, 1)
    }
}