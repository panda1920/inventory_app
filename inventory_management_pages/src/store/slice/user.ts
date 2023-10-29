import { createAction, createSlice } from '@reduxjs/toolkit'

import { eraseCookie, setCookie } from '@/helper/cookies'
import type { RootState } from '@/store/store'

type UserState = {
  token: string | null
}

export const loginAction = createAction<string>('user/login')
export const logoutAction = createAction('user/logout')

export function createUserSlice(initialState: UserState) {
  return createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers(builder) {
      builder.addCase(loginAction, (state, action) => {
        state.token = action.payload
        setCookie('token', action.payload)
      })
      builder.addCase(logoutAction, (state) => {
        state.token = null
        eraseCookie('token')
      })
    },
  })
}

export const checkLogin = (state: RootState) => !!state.user.token
