import { NextApiRequest, NextApiResponse } from 'next'

import { createCommonApiHandler } from '@/helper/api'
import { cookieNames, eraseCookieString } from '@/helper/cookies'
import { FailResponse, SuccessResponse } from '@/types/api/common'

type Data = SuccessResponse | FailResponse

const logoutHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const sessionCookie = req.cookies[cookieNames.sessionCookie]
  if (sessionCookie) {
    // remove cookie
    res.setHeader('Set-Cookie', eraseCookieString(cookieNames.sessionCookie))
  }
  // if no session cookie just do nothing

  res.status(200).json({ success: true })
}

const handlers = {
  POST: { handler: logoutHandler },
} as const

export default createCommonApiHandler(handlers)
