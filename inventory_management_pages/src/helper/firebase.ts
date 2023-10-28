import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export const app = getApps().length === 0 ? initializeApp({
  apiKey: "AIzaSyBKfsI8jYGW8pIvHrirMwr4fR_nkFIKdxw",
  authDomain: "inventory-323ee.firebaseapp.com",
  databaseURL: "https://inventory-323ee-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "inventory-323ee",
  storageBucket: "inventory-323ee.appspot.com",
  messagingSenderId: "27128093489",
  appId: "1:27128093489:web:62defbd783323613aa6e10"
}) : getApp()

export const auth = getAuth(app)
