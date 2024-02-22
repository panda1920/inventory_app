import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '@/store/store'

type AppState = {
  colorScheme: 'light' | 'dark'
}

const appSlice = createSlice({
  name: 'app',
  initialState: {
    colorScheme: 'light',
  } as AppState,
  reducers: {
    toggleColorScheme(state) {
      const nextColorScheme = state.colorScheme === 'light' ? 'dark' : 'light'
      state.colorScheme = nextColorScheme
    },
  },
})

export default appSlice

export const { toggleColorScheme } = appSlice.actions

export const getColorScheme = (state: RootState) => state.app.colorScheme
