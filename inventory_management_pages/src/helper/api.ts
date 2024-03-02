import { NextApiRequest, NextApiResponse } from 'next'

import { cookieNames, createUserTokenCookie, eraseCookieString } from '@/helper/cookies'
import { decryptEncryptedData } from '@/helper/encrypt'
import { InventoryAppServerError } from '@/helper/errors'
import { auth } from '@/helper/firebase-admin'
import { UserInfo } from '@/types/auth'

type Handler<T extends object = object> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  userId?: string,
) => Promise<void>

type HandlerSpec = {
  handler: Handler
  isRestricted?: boolean
}

export type HandlerSpecByMethods = {
  GET?: HandlerSpec
  POST?: HandlerSpec
  PUT?: HandlerSpec
  PATCH?: HandlerSpec
  DELETE?: HandlerSpec
}

type HttpMethod = keyof Required<HandlerSpecByMethods>

function isHttpMethod(method?: string): method is HttpMethod {
  return (
    method === 'GET' ||
    method === 'POST' ||
    method === 'PUT' ||
    method === 'PATCH' ||
    method === 'DELETE'
  )
}

export function createCommonApiHandler(handlers: HandlerSpecByMethods) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // make sure handler exist
      const { method } = req
      if (!isHttpMethod(method)) throw new InventoryAppServerError('Invalid HTTP method', 400)
      const spec = handlers[method]
      if (!spec) {
        throw new InventoryAppServerError(`Handler for ${method} is not defined`, 400)
      }

      // execute handler
      const { handler, isRestricted } = spec
      if (isRestricted) {
        const user = await authorizeUser(req, res)
        await handler(req, res, user.uid)
      } else {
        await handler(req, res)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e.message ?? e)
      res.status(e.errorCode ?? 500).json({ message: e.message ?? 'Internal server error' })
    }
  }
}

export async function authorizeUser(req: NextApiRequest, res: NextApiResponse) {
  let user: UserInfo | undefined

  // first attempt, get userinfo from token
  try {
    user = decodeTokenCookie(req.cookies)
    if (user) return user
  } catch (e) {
    console.error(e)
  }

  // if retrieval from token fails then get from session
  try {
    user = await decodeSessionCookie(req.cookies)
    if (!user) throw new Error('Failed to authorize')
    return user
  } catch (e) {
    console.error(e)
    throw new InventoryAppServerError('User unauthorized', 401)
  } finally {
    const cookies = user
      ? [
          // if user is found from session recreate token cookie
          createUserTokenCookie(user),
        ]
      : [
          // if user was not found from session invalidate both cookies
          eraseCookieString(cookieNames.tokenCookie),
          eraseCookieString(cookieNames.sessionCookie),
        ]
    res.setHeader('Set-Cookie', cookies)
  }
}

export function decodeTokenCookie(cookies: Partial<{ [key: string]: string }>) {
  const tokenCookie = cookies[cookieNames.tokenCookie]
  if (!tokenCookie) return

  const data = JSON.parse(decryptEncryptedData(tokenCookie))
  if (!verifyDataIsUserInfo(data)) throw new InventoryAppServerError('Invalid token', 400)

  return data
}

function verifyDataIsUserInfo(data: object): data is UserInfo {
  return 'uid' in data && 'username' in data && !!data.uid && !!data.username
}

export async function decodeSessionCookie(cookies: Partial<{ [key: string]: string }>) {
  const sessionCookie = cookies[cookieNames.sessionCookie]
  if (!sessionCookie) return

  const claims = await auth.verifySessionCookie(sessionCookie, true)

  const user = await auth.getUser(claims.uid)
  return {
    uid: user.uid,
    username: user.displayName || '',
  } satisfies UserInfo
}
