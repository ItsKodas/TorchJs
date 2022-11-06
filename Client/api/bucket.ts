//? Dependencies

import Config from '@lib/config'
import Headers from '@lib/common/headers'



//? Establish Connection with Server

export default () => {
    return new Promise((resolve, reject) => {

        fetch(`${Config.uri}/bucket`, {
            method: 'GET',
            headers: Headers
        })
            .then(async res => {
                const json = await res.json()

                if (json.error) return reject({ message: json.error, status: res.status })
                if (res.status != 200) return reject({ message: json.message, status: res.status })

                resolve({ data: json.data, status: res.status })
            })
            .catch(reject)

    })
}