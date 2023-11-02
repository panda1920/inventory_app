import jwt from 'jsonwebtoken'

// TODO: make it environment variable
const secret = 'secret'

/**
 * Creates a JWT from given payload
 * Expires in 30 days
 * @param payload
 */
export function signToken(payload: any) {
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
