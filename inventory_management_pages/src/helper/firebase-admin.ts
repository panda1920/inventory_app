import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FirestoreDataConverter, Timestamp, getFirestore } from 'firebase-admin/firestore'

export const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: Buffer.from(
            process.env.FIREBASE_PRIVATE_KEY_BASE64 || '',
            'base64',
          ).toString(),
        }),
      })
    : getApp()

// auth
export const auth = getAuth(app)

// firestore
export const db = getFirestore(app)

export const converter = <
  T extends FirebaseFirestore.DocumentData,
>(): FirestoreDataConverter<T> => ({
  toFirestore: (data) => {
    // remove id when inserting data
    const { id: _, ...rest } = data
    return rest
  },
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => {
    const data = snap.data()
    return {
      ...data,
      // return id
      id: snap.id,
      // convert firestore Timestamp to Date
      createdAt: (data.createdAt as Timestamp | undefined)?.toDate().toISOString(),
    } as T & { id: string; createdAt?: Date }
  },
})

export const getCollection = <T extends FirebaseFirestore.DocumentData>(collection: string) =>
  db.collection(collection).withConverter(converter<T>())
