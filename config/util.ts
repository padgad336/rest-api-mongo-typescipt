import config from 'config'
import jsonwebtoken from 'jsonwebtoken'

export const jwtSign = (payload: any, expiresIn = '2m') =>
  jsonwebtoken.sign(payload, config.get('jwt.secret'), { expiresIn })

export default {
  jwtSign,
}
