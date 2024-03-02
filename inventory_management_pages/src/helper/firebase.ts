import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, inMemoryPersistence, setPersistence } from 'firebase/auth'

export function getFirebaseApp() {
  return getApps().length === 0
    ? initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_APP_ID,
      })
    : getApp()
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp())
}

export function getInitializedFirebaseAuth() {
  const auth = getFirebaseAuth()
  auth.signOut()
  setPersistence(auth, inMemoryPersistence)

  return auth
}
