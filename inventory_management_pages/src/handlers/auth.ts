import { InventoryAppServerError } from '@/helper/errors'
import { auth } from '@/helper/firebase-admin'

export async function login(token: string) {
  // verify token
  try {
    await auth.verifyIdToken(token, true)
  } catch (e) {
    console.error(e)
    throw new InventoryAppServerError('Token verification failed', 401)
  }

  // create session cookie
  return await auth.createSessionCookie(token, {
    expiresIn: 1000 * 60 * 60 * 24 * 14, // 2 weeks, in milliseconds
  })
}
