import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { InventoryAppClientError } from '@/helper/errors'
import type { RootState } from '@/store/store'

// async thunks

type LoginActionPayload = {
  token: string
  username: string
}
export const loginAction = createAsyncThunk(
  'user/login',
  async ({ token, username }: LoginActionPayload, thunk) => {
    const url = '/api/auth/login'
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    }

    const response = await fetch(url, options)
    if (response.ok) {
      thunk.dispatch(saveSession({ username }))
      return await response.json()
    }

    return thunk.rejectWithValue(new InventoryAppClientError('Login Failed'))
  },
)

export const logoutAction = createAsyncThunk('user/logout', async (_, thunk) => {
  const url = '/api/auth/logout'
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const response = await fetch(url, options)
  const json = await response.json()
  if (response.ok) return json

  return thunk.rejectWithValue(new InventoryAppClientError(json.messasge ?? 'Error during logout'))
})

type UserState = {
  isLoggedIn: boolean
  username?: string
}

const userSlice = createSlice({
  name: 'user',
  initialState: { isLoggedIn: false } as UserState,
  reducers: {
    saveSession(state, action: PayloadAction<{ username: string }>) {
      const { username } = action.payload
      state.isLoggedIn = true
      state.username = username
    },
    clearSession(state) {
      state.isLoggedIn = false
      state.username = undefined
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginAction.fulfilled, (state, action) => {
        const { username } = action.payload
        state.isLoggedIn = true
        state.username = username
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.isLoggedIn = false
        state.username = undefined
      })
  },
})

export default userSlice

// actions
export const { saveSession, clearSession } = userSlice.actions

// selectors
export const checkLogin = (state: RootState) => !!state.user.isLoggedIn
export const getUsername = (state: RootState) => state.user.username
