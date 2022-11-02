//? Dependencies

import Config from '@lib/config'
import Headers from '@lib/common/headers'



//? Establish Connection with Server

export default () => {

    fetch(`${Config.uri}/establish`, {
        method: 'POST',
        headers: Headers
    })
        .then(res => res.json())
        .then(json => {
            if (json.error) return console.error(json.error)
            console.info(json.message)
        })
        .catch(err => console.error(err))

}