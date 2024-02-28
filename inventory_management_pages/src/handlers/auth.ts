import { cookieNames, createUserTokenCookie, setCookieString } from '@/helper/cookies'
import { InventoryAppServerError } from '@/helper/errors'
import { auth } from '@/helper/firebase-admin'

const SESSION_EXPIRES_IN_MS = 1000 * 60 * 60 * 24 * 14 // 2 weeks
const TOKEN_EXPIRES_IN_MS = 1000 * 60 * 60 * 24 // 1 day

export async function login(token: string) {
  // verify token
  try {
    const decodedToken = await auth.verifyIdToken(token, true)
    const user = await auth.getUser(decodedToken.uid)

    const sessionCookie = setCookieString(
      cookieNames.sessionCookie,
      await auth.createSessionCookie(token, {
        expiresIn: SESSION_EXPIRES_IN_MS,
      }),
      new Date(Date.now() + SESSION_EXPIRES_IN_MS),
    )
    const tokenCookie = setCookieString(
      cookieNames.tokenCookie,
      createUserTokenCookie({ uid: user.uid, username: user.displayName || '' }),
      new Date(Date.now() + TOKEN_EXPIRES_IN_MS),
    )

    return {
      sessionCookie,
      tokenCookie,
    }
  } catch (e) {
    console.error(e)
    throw new InventoryAppServerError('Token verification failed', 401)
  }
}
