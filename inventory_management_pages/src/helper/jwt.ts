import jwt from 'jsonwebtoken'

const secret = process.env.TOKEN_SECRET || ''

/**
 * Creates a JWT from given payload
 * Expires in 30 days
 * @param payload
 */
export function signToken(payload: string | object | Buffer) {
  return jwt.sign(payload, secret, { expiresIn: '30d' })
}

/**
 * Verify token signature and its content
 * @param token
 */
export function verifyToken(token: string) {
  const payload = jwt.verify(token, secret)
  // TODO: verify content of jwt
  console.log('🚀 ~ file: jwt.ts:12 ~ verifyToken ~ payload:', payload)
}
