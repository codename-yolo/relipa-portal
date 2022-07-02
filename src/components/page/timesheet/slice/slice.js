import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { get } from '../../../service/requestApi'
import reducerRegistry from '../../../../store/reducerRegister'
import { dateTime } from '../../../index'

export const getTimeSheet = createAsyncThunk('getTimeSheet', async (params) => {
  const { page, sort, startDate, endDate, perPage } = params

  let response = null
  if (!startDate) {
    response = await get(
      `/worksheet?sort=${sort}&end_date=${dateTime.formatDate(
        endDate,
      )}&per_page=${perPage}&page=${page}`,
    )
  } else if (!endDate) {
    response = await get(
      `/worksheet?sort=${sort}&start_date=${dateTime.formatDate(
        startDate,
      )}&per_page=${perPage}&page=${page}`,
    )
  } else {
    response = await get(
      `/worksheet?sort=${sort}&start_date=${dateTime.formatDate(
        startDate,
      )}&end_date=${dateTime.formatDate(
        endDate,
      )}&per_page=${perPage}&page=${page}`,
    )
  }
  return response
})

const timeSheetSlice = createSlice({
  name: 'timeSheet',
  initialState: {
    data: [],
    current_page: 1,
    per_page: 10,
    last_page: 1,
    isLoading: false,
    total: 0,
  },
  extraReducers: {
    [getTimeSheet.fulfilled]: (state, action) => {
      state.data = action.payload.data
      state.current_page = action.payload.current_page
      state.per_page = action.payload.per_page
      state.last_page = action.payload.last_page
      state.isLoading = false
      state.total = action.payload.total
    },
    [getTimeSheet.pending]: (state) => {
      state.isLoading = true
    },

    [getTimeSheet.rejected]: (state) => {
      state.isLoading = true
    },
  },
})

reducerRegistry.register(timeSheetSlice.name, timeSheetSlice.reducer)
