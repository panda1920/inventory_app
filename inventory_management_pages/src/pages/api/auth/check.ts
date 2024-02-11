import { NextApiRequest, NextApiResponse } from 'next'

import { HandlerSpecByMethods, createCommonApiHandler } from '@/helper/api'
import { auth } from '@/helper/firebase-admin'
import { FailResponse, SuccessResponse } from '@/types/api/common'

type Data = SuccessResponse | FailResponse

// a simple API endpoint that checks validity of session cookie value
const checkHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const token = req.query.token
  if (!token || Array.isArray(token))
    return res.status(401).json({ success: false, message: 'Invalid' })

  try {
    await auth.verifySessionCookie(token)
    res.status(200).json({ success: true })
  } catch (e) {
    res.status(401).json({ success: false, message: 'Invalid' })
  }
}

const handlers = {
  GET: { handler: checkHandler },
} satisfies HandlerSpecByMethods

export default createCommonApiHandler(handlers)
