import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export function getFirebaseApp() {
  return getApps().length === 0
    ? initializeApp({
        apiKey: 'AIzaSyBKfsI8jYGW8pIvHrirMwr4fR_nkFIKdxw',
        authDomain: 'inventory-323ee.firebaseapp.com',
        databaseURL: 'https://inventory-323ee-default-rtdb.asia-southeast1.firebasedatabase.app',
        projectId: 'inventory-323ee',
        storageBucket: 'inventory-323ee.appspot.com',
        messagingSenderId: '27128093489',
        appId: '1:27128093489:web:62defbd783323613aa6e10',
      })
    : getApp()
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp())
}
