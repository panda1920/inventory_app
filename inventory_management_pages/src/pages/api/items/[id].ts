import { NextApiRequest, NextApiResponse } from 'next'

import { editItem, removeItem } from '@/handlers/item'
import { HandlerSpecByMethods, createCommonApiHandler } from '@/helper/api'
import { idPathParameterSchema } from '@/types/api/common'
import { DeleteItemResponse, UpdateItemResponse } from '@/types/api/item'
import { updateItemSchema } from '@/types/form/item'
import { parseAsSchemaType } from '@/types/form/serverside-common'

// PATCH
const updateItem = async (
  req: NextApiRequest,
  res: NextApiResponse<UpdateItemResponse>,
  userId: string = 'TEST_OWNER',
) => {
  const id = parseAsSchemaType(req.query.id, idPathParameterSchema)
  const body = parseAsSchemaType(req.body, updateItemSchema)

  await editItem({ id, ...body, ownerId: userId })

  res.status(200).json({ success: true })
}

// DELETE
const deleteItem = async (
  req: NextApiRequest,
  res: NextApiResponse<DeleteItemResponse>,
  userId: string = 'TEST_OWNER',
) => {
  const id = parseAsSchemaType(req.query.id, idPathParameterSchema)

  await removeItem({ id, ownerId: userId })

  res.status(200).json({ success: true })
}

const handlers = {
  PATCH: { handler: updateItem, isRestricted: true },
  DELETE: { handler: deleteItem, isRestricted: true },
} satisfies HandlerSpecByMethods

export default createCommonApiHandler(handlers)
