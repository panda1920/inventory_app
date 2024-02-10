import { FieldValue } from 'firebase-admin/firestore'

import { InventoryAppServerError } from '@/helper/errors'
import { getCollection } from '@/helper/firebase-admin'
import { GetListQueryParameterSchema } from '@/types/api/common'
import { Item } from '@/types/entity/item'
import { RegisterItemSchema, UpdateItemSchema } from '@/types/form/item'

const itemCollection = getCollection<Item>('items')
const addItemCollection = getCollection<Omit<Item, 'id'>>('items')

export async function listItems(params: GetListQueryParameterSchema & { ownerId: string }) {
  const { ownerId, start_after, limit } = params

  // get snapshort for cursor pagination
  const startAfterSnapshot = start_after
    ? await getDocumentSnapshotById(itemCollection, start_after, ownerId)
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

  const itemRef = await addItemCollection.add({
    ...registerParams,
    ownerId,
    sortOrder,
    createdAt: FieldValue.serverTimestamp(),
  })
  const item = (await itemRef.get()).data() as Item
  if (!item) throw new InventoryAppServerError('Failed to register item')

  return item
}

export async function editItem(params: UpdateItemSchema & { ownerId: string; id: string }) {
  const { id, ownerId, ...updateParams } = params

  const docRef = itemCollection.doc(id)
  if (!(await isOwner(ownerId, docRef))) throw new InventoryAppServerError('Unauthorized', 401)

  await docRef.update(updateParams)
}

export async function removeItem(params: { ownerId: string; id: string }) {
  const { id, ownerId } = params

  const docRef = itemCollection.doc(id)
  if (!(await isOwner(ownerId, docRef))) throw new InventoryAppServerError('Unauthorized', 401)

  await docRef.delete()
}

export async function getItem(params: { id: string; ownerId: string }) {
  const { id, ownerId } = params

  const docRef = itemCollection.doc(id)
  if (!(await isOwner(ownerId, docRef))) throw new InventoryAppServerError('Unauthorized', 401)

  const item = (await docRef.get()).data()

  if (!item) throw new InventoryAppServerError('Failed to get item')

  return item
}

async function getDocumentSnapshotById(
  collectionRef: FirebaseFirestore.CollectionReference<Item>,
  id: string,
  ownerId?: string,
) {
  const docRef = collectionRef.doc(id)
  // not owner
  if (ownerId && !(await isOwner(ownerId, docRef))) return undefined

  const snapshot = await docRef.get()

  return snapshot.exists ? snapshot : undefined
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

async function isOwner<T extends { ownerId: string }>(
  ownerId: string,
  docRef: FirebaseFirestore.DocumentReference<T>,
) {
  const snapshot = await docRef.get()
  if (!snapshot.exists) return false

  const data = snapshot.data()
  return data && data.ownerId === ownerId
}
