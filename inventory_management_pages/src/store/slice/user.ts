import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '@/store/store'

type UserState = {
  isLoggedIn: boolean
  username?: string
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
  },
})

export default userSlice

// actions
export const { login: loginAction, logout: logoutAction } = userSlice.actions

// selectors
export const checkLogin = (state: RootState) => !!state.user.isLoggedIn
export const getUsername = (state: RootState) => state.user.username
