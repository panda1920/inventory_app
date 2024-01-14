import { NextApiRequest, NextApiResponse } from 'next'

import { login } from '@/handlers/auth'
import { HandlerSpecByMethods, createCommonApiHandler } from '@/helper/api'
import { cookieNames, setCookieString } from '@/helper/cookies'
import { FailResponse, SuccessResponse } from '@/types/api/common'

type Data = SuccessResponse | FailResponse

const loginHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const token = req.body.token
  if (!token) return res.status(400).json({ success: false })

  const cookieValue = await login(token)

  res
    .setHeader('Set-Cookie', setCookieString(cookieNames.sessionCookie, cookieValue))
    .status(200)
    .json({ success: true })
}

const handlers = {
  POST: { handler: loginHandler },
} satisfies HandlerSpecByMethods

export default createCommonApiHandler(handlers)
