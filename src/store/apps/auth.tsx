// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Set Access Token
export const stAccessToken = createAsyncThunk('appAuth/stAccessToken', async (data:any) => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  console.log('appAuth/stAccessToken=', accessToken, data)
  return data
})

// ** Set Access Token Verify
export const stAccessTokenVerify : any = createAsyncThunk('appAuth/stAccessTokenVerify', async (data:any) => {
  // const accessToken = localStorage.getItem("ACCESS_TOKEN");
  // console.log('appAuth/stAccessTokenVerify=',accessToken,data)
  return data
})

export const appAuthSlice = createSlice({
  name: 'appAuth',
  initialState: {
    stAccessToken: '',
    stAccessTokenVerify: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(stAccessToken.fulfilled, (state:any, action) => {
      state.stAccessToken = action.payload;
    })
    builder.addCase(stAccessTokenVerify.fulfilled, (state:any, action) => {
      state.stAccessTokenVerify = action.payload;
    })
  }
})

export default appAuthSlice.reducer
