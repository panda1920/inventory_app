import { NextApiRequest, NextApiResponse } from 'next'

import { HandlerSpecByMethods, createCommonApiHandler } from '@/helper/api'
import { cookieNames, eraseCookieString } from '@/helper/cookies'
import { FailResponse, SuccessResponse } from '@/types/api/common'

type Data = SuccessResponse | FailResponse

const logoutHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const sessionCookie = req.cookies[cookieNames.sessionCookie]
  const tokenCookie = req.cookies[cookieNames.tokenCookie]
  const cookiesToErase = []

  // remove cookies
  if (sessionCookie) cookiesToErase.push(eraseCookieString(cookieNames.sessionCookie))
  if (tokenCookie) cookiesToErase.push(eraseCookieString(cookieNames.tokenCookie))
  res.setHeader('Set-Cookie', cookiesToErase)

  res.status(200).json({ success: true })
}

const handlers = {
  POST: { handler: logoutHandler },
} as HandlerSpecByMethods

export default createCommonApiHandler(handlers)
