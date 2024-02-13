import { FieldValue } from 'firebase-admin/firestore'

import { InventoryAppServerError } from '@/helper/errors'
import { getCollection } from '@/helper/firebase-admin'
import { GetListQueryParameterSchema } from '@/types/api/common'
import { Item } from '@/types/entity/item'
import { RegisterItemSchema, UpdateItemSchema } from '@/types/form/item'

const itemCollection = getCollection<Item>('items')

export async function listItems(params: GetListQueryParameterSchema & { ownerId: string }) {
  const { ownerId, start_after, limit } = params

  // get snapshort for cursor pagination
  const startAfterSnapshot = start_after
    ? await getOwnedSnapshotById(itemCollection, start_after, ownerId)
    : undefined

  let query = itemCollection
    .where('ownerId', '==', ownerId)
    .orderBy('sortOrder', 'asc')
    .limit(limit)

  if (startAfterSnapshot) query = query.startAfter(startAfterSnapshot)

  return (await query.get()).docs.map((snapshot) => snapshot.data())
}

export async function registerItem(params: RegisterItemSchema & { ownerId: string }) {
  const { ownerId, ...registerParams } = params

  const sortOrder = await getMaxPlus1SortOrder(itemCollection, ownerId)

  const itemRef = await itemCollection.add({
    id: '', // it gets thrown away so just specify some random id
    ...registerParams,
    ownerId,
    sortOrder,
    createdAt: FieldValue.serverTimestamp(),
  })
  const item = (await itemRef.get()).data()
  if (!item) throw new InventoryAppServerError('Failed to register item')

  return item
}

export async function editItem(params: UpdateItemSchema & { ownerId: string; id: string }) {
  const { id, ownerId, ...updateParams } = params

  const snapshot = await getOwnedSnapshotById(itemCollection, id, ownerId)

  await snapshot.ref.update(updateParams)
}

export async function removeItem(params: { ownerId: string; id: string }) {
  const { id, ownerId } = params

  const snapshot = await getOwnedSnapshotById(itemCollection, id, ownerId)

  await snapshot.ref.delete()
}

export async function getItem(params: { id: string; ownerId: string }) {
  const { id, ownerId } = params

  const snapshot = await getOwnedSnapshotById(itemCollection, id, ownerId)

  return snapshot.data()!
}

async function getOwnedSnapshotById(
  collectionRef: FirebaseFirestore.CollectionReference<Item>,
  id: string,
  ownerId?: string,
) {
  const docSnapshot = await collectionRef.doc(id).get()
  const data = docSnapshot.data()

  if (!docSnapshot.exists || !data) throw new InventoryAppServerError('Record does not exist', 400)
  if (data.ownerId !== ownerId) throw new InventoryAppServerError('Unauthorized', 401)

  return docSnapshot
}

async function getMaxPlus1SortOrder(
  collectionRef: FirebaseFirestore.CollectionReference<Item>,
  ownerId: string,
) {
  const querySnapshot = await collectionRef
    .where('ownerId', '==', ownerId)
    .orderBy('sortOrder', 'desc')
    .limit(1)
    .get()

  return (querySnapshot.docs?.[0]?.data().sortOrder ?? -1) + 1
}
