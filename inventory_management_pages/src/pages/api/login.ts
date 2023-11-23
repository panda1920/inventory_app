import { NextApiRequest, NextApiResponse } from 'next'

import { createCommonApiHandler } from '@/helper/api'
import { cookieNames, setCookieString } from '@/helper/cookies'
import { InventoryAppServerError } from '@/helper/errors'
import { auth } from '@/helper/firebase-admin'
import { FailResponseData, SuccessResponseData } from '@/types/api'

type Data = SuccessResponseData | FailResponseData

const loginHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const token = req.body.token
  if (!token) return res.status(400).json({ success: false })

  // verify token
  try {
    await auth.verifyIdToken(token, true)
  } catch (e) {
    console.error(e)
    throw new InventoryAppServerError('Token verification failed', 401)
  }

  // create session cookie
  const cookieValue = await auth.createSessionCookie(token, {
    expiresIn: 1000 * 60 * 60 * 24 * 14, // 2 weeks, in milliseconds
  })

  res
    .setHeader('Set-Cookie', setCookieString(cookieNames.sessionCookie, cookieValue))
    .status(200)
    .json({ success: true })
}

const handlers = {
  POST: { handler: loginHandler },
} as const

export default createCommonApiHandler(handlers)
