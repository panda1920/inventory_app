import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AuthCredential, OAuthProvider } from 'firebase/auth'

import type { RootState } from '@/store/store'

type UserState = {
  isLoggedIn: boolean
  username?: string
  temporaryCredential?: string
}

const userSlice = createSlice({
  name: 'user',
  initialState: { isLoggedIn: false } as UserState,
  reducers: {
    login(state, action: PayloadAction<{ username: string }>) {
      // TODO: login may become async function
      const { username } = action.payload
      state.isLoggedIn = true
      state.username = username
    },
    logout(state) {
      state.isLoggedIn = false
      state.username = undefined
    },
    saveTemporaryCredential(state, action: PayloadAction<{ credential: AuthCredential }>) {
      state.temporaryCredential = JSON.stringify(action.payload.credential.toJSON())
    },
    clearTemporaryCredential(state) {
      state.temporaryCredential = undefined
    },
  },
})

export default userSlice

// actions
export const {
  login: loginAction,
  logout: logoutAction,
  saveTemporaryCredential: saveTemporaryCredentialAction,
  clearTemporaryCredential: clearTemporaryCredentialAction,
} = userSlice.actions

// selectors
export const checkLogin = (state: RootState) => !!state.user.isLoggedIn
export const getUsername = (state: RootState) => state.user.username
export const getTemporaryCredential = (state: RootState) =>
  state.user.temporaryCredential
    ? OAuthProvider.credentialFromJSON(state.user.temporaryCredential)
    : undefined
