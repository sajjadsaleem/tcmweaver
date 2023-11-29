// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Set Access Token Verify
export const stGetManagers = createAsyncThunk('appUsers/stGetManagers', async (data, { dispatch }) => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  // console.log('stGetManagers>>>>>>>>>>=',data)
  var payload = data
  const response = await axios.post("/api/managers", payload, {
    headers: {
      Authorization: "Bearer " + accessToken
    }
  })

  return response.data
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    stGetManagers: [],
    stGetManagerData: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(stGetManagers.fulfilled, (state, action) => {
      state.stGetManagers = action.payload.managers;
      state.stGetManagerData = action.payload.managersData;
    })
  }
})

export default appUsersSlice.reducer
