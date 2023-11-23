import { NextApiRequest, NextApiResponse } from 'next'

import { InventoryAppServerError } from './errors'

type Handler<T = {}> = (req: NextApiRequest, res: NextApiResponse<T>) => Promise<void>

type HandlerSpec = {
  handler: Handler
  isRestricted?: boolean
}

type HandlerSpecByMethods = {
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

export const createCommonApiHandler = (handlers: HandlerSpecByMethods) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (!isHttpMethod(req.method)) throw new InventoryAppServerError('Invalid HTTP method', 400)
      if (!handlers[req.method])
        throw new InventoryAppServerError(`Handler for ${req.method} is not defined`, 400)

      await handlers[req.method]?.handler(req, res)
    } catch (e: any) {
      console.error(e)
      res.status(e.errorCode ?? 500).json({ message: e.message ?? 'Internal server error' })
    }
  }
}
