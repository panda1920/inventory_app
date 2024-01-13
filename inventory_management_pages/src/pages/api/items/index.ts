import { NextApiRequest, NextApiResponse } from 'next'

import { listItems, registerItem } from '@/handlers/item'
import { HandlerSpecByMethods, createCommonApiHandler } from '@/helper/api'
import { getListQueryParameterSchema } from '@/types/api/common'
import { GetItemsResponse, RegisterItemResponse } from '@/types/api/item'
import { registerItemSchema } from '@/types/form/item'
import { parseAsSchemaType } from '@/types/form/serverside-common'

// POST
const postItem = async (
  req: NextApiRequest,
  res: NextApiResponse<RegisterItemResponse>,
  userId: string = 'TEST_OWNER',
) => {
  const body = parseAsSchemaType(req.body, registerItemSchema)

  const item = await registerItem({ ...body, ownerId: userId })

  res.status(200).json({ success: true, item })
}

// GET
const getItems = async (
  req: NextApiRequest,
  res: NextApiResponse<GetItemsResponse>,
  userId: string = 'TEST_OWNER',
) => {
  const query = parseAsSchemaType(req.query, getListQueryParameterSchema)

  const items = await listItems({ ...query, ownerId: userId })

  res.status(200).json({ success: true, items })
}

const handlers: HandlerSpecByMethods = {
  POST: { handler: postItem, isRestricted: true },
  GET: { handler: getItems, isRestricted: true },
}

export default createCommonApiHandler(handlers)

// async function addOrderToItems(querySnapshot: FirebaseFirestore.QuerySnapshot<Item>) {
//   // batch write
//   const batch = db.batch()

//   querySnapshot.docs.forEach((snapshot, idx) => {
//     batch.update(snapshot.ref, { sortOrder: idx })
//   })

//   await batch.commit()
// }
