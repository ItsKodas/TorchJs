//? Dependencies

import { randomBytes, pbkdf2Sync } from 'crypto'



//? Hash Password + Salt

export default (password: string, salt?: string) => {

    const Salt = salt || randomBytes(16).toString('hex')
    const Hash = pbkdf2Sync(password, Salt, 10000, 64, 'sha256').toString('hex')

    return { salt: Salt, hash: Hash }

}
