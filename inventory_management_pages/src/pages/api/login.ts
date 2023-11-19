import { NextApiRequest, NextApiResponse } from 'next'

import { commonApiHandler as createCommonApiHandler } from '@/helper/api'
import { cookieNames, setCookieString } from '@/helper/cookies'
import { InventoryAppServerError } from '@/helper/errors'
import { auth } from '@/helper/firebase-admin'

type SuccessResponseData = {
  success: true
}

type FailResponseData = {
  success: false
  message?: string
}

type Data = SuccessResponseData | FailResponseData

const handlers = {
  POST: async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const token = req.body.token
    if (!token) return res.status(400).json({ success: false })

    // verify token
    try {
      await auth.verifyIdToken(token, true)
    } catch (e) {
      throw new InventoryAppServerError('Token verification failed', 401)
    }
    // const user = await auth.getUser(decoded.uid)
    // console.log('🚀 ~ file: login.ts:27 ~ handler ~ user:', user)

    // create session cookie
    const cookieValue = await auth.createSessionCookie(token, {
      expiresIn: 1000 * 60 * 60 * 24 * 14, // 2 weeks, in milliseconds
    })

    res
      .setHeader('Set-Cookie', setCookieString(cookieNames.sessionCookie, cookieValue))
      .status(200)
      .json({ success: true })
  },
} as const

export default createCommonApiHandler(handlers)
