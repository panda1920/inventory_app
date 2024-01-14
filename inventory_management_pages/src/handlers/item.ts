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

  const itemRef = await itemCollection.add({
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

async function getDocumentSnapshotById(
  collectionRef: FirebaseFirestore.CollectionReference<Item>,
  id: string,
  ownerId?: string,
) {
  const documentRef = collectionRef.doc(id)
  // not owner
  if (ownerId && !(await isOwner(ownerId, documentRef))) return undefined

  const snapshot = await documentRef.get()

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
  const data = (await docRef.get()).data()
  return data && data.ownerId === ownerId
}