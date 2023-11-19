import { NextApiRequest, NextApiResponse } from 'next'

import { InventoryAppServerError } from './errors'

type HandlersByMethods = {
  GET?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
  POST?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
  PUT?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
  PATCH?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
  DELETE?: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
}

type HttpMethod = keyof Required<HandlersByMethods>

function isHttpMethod(method?: string): method is HttpMethod {
  return (
    method === 'GET' ||
    method === 'POST' ||
    method === 'PUT' ||
    method === 'PATCH' ||
    method === 'DELETE'
  )
}

export const commonApiHandler = (handlers: HandlersByMethods) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (!isHttpMethod(req.method)) throw new InventoryAppServerError('Invalid HTTP method', 400)
      if (!handlers[req.method])
        throw new InventoryAppServerError(`Handler for ${req.method} is not defined`, 400)

      await handlers[req.method]
    } catch (e: any) {
      console.error(e)
      res.status(e.errorCode ?? 500).json({ message: e.message ?? 'Internal server error' })
    }
  }
}
