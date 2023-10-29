import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { RootState } from '@/store/store'

export type CounterState = {
  count: number
  status: 'none' | 'pending' | 'success'
}

export const fetchCount = createAsyncThunk('fetchCount', async () => {
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(3)
    }, 1000)
  })
})

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0, status: 'none' } as CounterState,
  reducers: {
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    },
    setCount(state, action) {
      state.count = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCount.pending, (state) => {
        state.status = 'pending'
      })
      .addCase(fetchCount.fulfilled, (state, action) => {
        state.status = 'success'
        state.count = action.payload
      })
  },
})

export default counterSlice

// not necessary to export anything below but it is for conveneience
export const {
  increment: incrementAction,
  decrement: decrementAction,
  setCount: setCountAction,
} = counterSlice.actions

export const getCurrentCount = (state: RootState) => state.counter.count
