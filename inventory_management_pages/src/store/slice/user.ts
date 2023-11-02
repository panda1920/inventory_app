import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { cookieNames, eraseCookie, setCookie } from '@/helper/cookies'
import type { RootState } from '@/store/store'

type UserState = {
  token: string | null
}

const userSlice = createSlice({
  name: 'user',
  initialState: { token: null } as UserState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      // TODO: login may become async function
      state.token = action.payload
      setCookie(cookieNames.tokenCookie, action.payload)
    },
    logout(state) {
      state.token = null
      eraseCookie(cookieNames.tokenCookie)
    },
  },
})

export default userSlice

export const { login: loginAction, logout: logoutAction } = userSlice.actions

export const checkLogin = (state: RootState) => !!state.user.token
