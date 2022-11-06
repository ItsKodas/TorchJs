//? Dependencies

import Config from '@lib/config'
import Headers from '@lib/common/headers'



//? Establish Connection with Server

export default () => {
    return new Promise((resolve, reject) => {

        fetch(`${Config.uri}/establish`, {
            method: 'POST',
            headers: Headers
        })
            .then(async res => {
                const json = await res.json()

                if (json.error) return resolve({ message: json.error, status: res.status })
                resolve({ message: json.message, status: res.status })
            })
            .catch(reject)

    })
}