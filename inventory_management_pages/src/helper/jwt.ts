import jwt from 'jsonwebtoken'

// TODO: make it environment variable
const secret = 'secret'

/**
 * Verify token signature and its content
 * @param token
 */
export function verifyToken(token: string) {
  const payload = jwt.verify(token, secret)
  // TODO: verify content of jwt
  console.log('🚀 ~ file: jwt.ts:12 ~ verifyToken ~ payload:', payload)
}
