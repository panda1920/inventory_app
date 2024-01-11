import { NextApiRequest, NextApiResponse } from 'next'

import { HandlerSpecByMethods, createCommonApiHandler } from '@/helper/api'
import { getCollection } from '@/helper/firebase-admin'
import { idPathParameterSchema } from '@/types/api/common'
import { DeleteItemResponse, UpdateItemResponse } from '@/types/api/item'
import { Item } from '@/types/entity/item'
import { updateItemSchema } from '@/types/form/item'
import { parseAsSchemaType } from '@/types/form/serverside-common'

// PATCH
const updateItem = async (req: NextApiRequest, res: NextApiResponse<UpdateItemResponse>) => {
  const id = parseAsSchemaType(req.query.id, idPathParameterSchema)
  const body = parseAsSchemaType(req.body, updateItemSchema)

  // TODO: check that item belongs to the owner
  // update
  await getCollection<Item>('items').doc(id).update(body)

  res.status(200).json({ success: true })
}

// DELETE
const deleteItem = async (req: NextApiRequest, res: NextApiResponse<DeleteItemResponse>) => {
  const id = parseAsSchemaType(req.query.id, idPathParameterSchema)

  // TODO: check that item belongs to the owner
  await getCollection<Item>('items').doc(id).delete()

  res.status(200).json({ success: true })
}

const handlers = {
  PATCH: { handler: updateItem, isRestricted: false },
  DELETE: { handler: deleteItem, isRestricted: false },
} satisfies HandlerSpecByMethods

export default createCommonApiHandler(handlers)
