import { NextApiRequest, NextApiResponse } from 'next'

import { HandlerSpecByMethods, createCommonApiHandler } from '@/helper/api'
import { FailResponse, SuccessResponse } from '@/types/api/common'

type Response = SuccessResponse | FailResponse

const healthHandler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  res.status(200).send({ success: true })
}

const handlers = {
  GET: { handler: healthHandler },
} satisfies HandlerSpecByMethods

export default createCommonApiHandler(handlers)
