import { NextApiRequest, NextApiResponse } from 'next'

import { cookieNames, eraseCookieString } from '@/helper/cookies'
import { decryptEncryptedData } from '@/helper/encrypt'
import { InventoryAppServerError } from '@/helper/errors'
import { auth } from '@/helper/firebase-admin'

type Handler<T extends object = {}> = (
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
        const claim = await authorizeUser(req, res)
        await handler(req, res, claim.uid)
      } else {
        await handler(req, res)
      }
    } catch (e: any) {
      console.error(e.message ?? e)
      res.status(e.errorCode ?? 500).json({ message: e.message ?? 'Internal server error' })
    }
  }
}

export async function authorizeUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const claim = await decodeSessionCookie(req.cookies)

    if (!claim) throw new Error('Failed to authorize')
    return claim
  } catch (e) {
    console.error(e)
    // invalidate session if failed to verify
    res.setHeader('Set-Cookie', eraseCookieString(cookieNames.sessionCookie))
    throw new InventoryAppServerError('User unauthorized', 401)
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
