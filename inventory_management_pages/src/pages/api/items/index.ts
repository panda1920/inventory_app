import { FieldValue } from 'firebase-admin/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

import { HandlerSpecByMethods, createCommonApiHandler } from '@/helper/api'
import { InventoryAppServerError } from '@/helper/errors'
import { getCollection } from '@/helper/firebase-admin'
import { getListQueryParameterSchema } from '@/types/api/common'
import { GetItemsResponse, RegisterItemResponse } from '@/types/api/item'
import { Item } from '@/types/entity/item'
import { registerItemSchema } from '@/types/form/item'
import { parseAsSchemaType } from '@/types/form/serverside-common'

// POST
const registerItem = async (req: NextApiRequest, res: NextApiResponse<RegisterItemResponse>) => {
  const body = parseAsSchemaType(req.body, registerItemSchema)
  const items = getCollection<Item>('items')

  // TODO: specify ownerId
  const sortOrder = await getMaxSortOrder(items, '1')

  const itemRef = await items.add({
    ...body,
    // TODO: retrieve this from credentials
    ownerId: '1',
    sortOrder,
    createdAt: FieldValue.serverTimestamp(),
  })
  const item = (await itemRef.get()).data()
  if (!item) throw new InventoryAppServerError('Failed to register item')

  res.status(200).json({ success: true, item })
}

// GET
const getItems = async (req: NextApiRequest, res: NextApiResponse<GetItemsResponse>) => {
  const query = parseAsSchemaType(req.query, getListQueryParameterSchema)

  // TODO: specify ownerId
  const querySnapshot = await getCollection<Item>('items')
    .where('ownerId', '==', '1')
    .orderBy('sortOrder', 'asc')
    .startAt(query.offset)
    .limit(query.limit)
    .get()
  const items = querySnapshot.docs.map((snapshot) => snapshot.data())

  res.status(200).json({ success: true, items })
}

const handlers: HandlerSpecByMethods = {
  POST: { handler: registerItem, isRestricted: true },
  GET: { handler: getItems, isRestricted: true },
}

export default createCommonApiHandler(handlers)

async function getMaxSortOrder(
  collectionRef: FirebaseFirestore.CollectionReference<Item>,
  ownerId: string,
) {
  const querySnapshot = await collectionRef
    .where('ownerId', '==', ownerId)
    .orderBy('sortOrder', 'desc')
    .limit(1)
    .get()

  return querySnapshot.docs?.[0].data().sortOrder + 1 ?? 0
}

// async function addOrderToItems(querySnapshot: FirebaseFirestore.QuerySnapshot<Item>) {
//   // batch write
//   const batch = db.batch()

//   querySnapshot.docs.forEach((snapshot, idx) => {
//     batch.update(snapshot.ref, { sortOrder: idx })
//   })

//   await batch.commit()
// }
