import { createSessionCookie, createUserTokenCookie } from '@/helper/cookies'
import { InventoryAppServerError } from '@/helper/errors'
import { auth } from '@/helper/firebase-admin'

export async function login(token: string) {
  // verify token
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    const user = await auth.getUser(decodedToken.uid)

    return [
      await createSessionCookie(token),
      createUserTokenCookie({ uid: user.uid, username: user.displayName || '' }),
    ]
  } catch (e) {
    console.error(e)
    throw new InventoryAppServerError('Token verification failed', 401)
  }
}
