// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Set Access Token Verify
export const stGetShipments = createAsyncThunk('appShipment/stGetShipments', async (data, { dispatch }) => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  console.log('stGetShipments>>>>>>>>>>=',data)
  var payload = data
  payload.fetch_carriers = false
  const response = await axios.post("/api/shipments", payload, {
    headers: {
      Authorization: "Bearer "+accessToken
    }
  })

  setTimeout(() => {
    dispatch(stGetShipmentsFetchCarrier({currentPage: data.currentPage}))
  }, 1000);

  return response.data
})

// ** Fetch Carriers
export const stGetShipmentsFetchCarrier = createAsyncThunk('appShipment/stGetShipmentsFetchCarrier', async (data) => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  var payload = data
  payload.fetch_carriers = true
  const response = await axios.post("/api/shipments", payload, {
    headers: {
      Authorization: "Bearer "+accessToken
    }
  })

  return response.data
})

// ** Fetch Carriers
export const stGetShipmentsSearch = createAsyncThunk('appShipment/stGetShipmentsSearch', async (data) => {
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  var payload = data
  payload.fetch_carriers = false
  const response = await axios.post("/api/shipments", payload, {
    headers: {
      Authorization: "Bearer "+accessToken
    }
  })

  return response.data
})

// ** Fetch Carriers
export const stSelectShipment = createAsyncThunk('appShipment/stSelectShipment', async (data) => {
  console.log('stSelectShipment=',data)
  return data
})

export const appShipmentSlice = createSlice({
  name: 'appShipment',
  initialState: {
    stGetShipments: [],
    stGetShipmentsData: {},
    stSelectShipment: {},
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(stGetShipments.fulfilled, (state, action) => {
      state.stGetShipments = action.payload.shipments;
      state.stGetShipmentsData = action.payload.shipmentsData;
    })
    builder.addCase(stGetShipmentsFetchCarrier.fulfilled, (state, action) => {
      state.stGetShipments = action.payload.shipments;
      state.stGetShipmentsData = action.payload.shipmentsData;
    })
    builder.addCase(stGetShipmentsSearch.fulfilled, (state, action) => {
      state.stGetShipments = action.payload.shipments;
      state.stGetShipmentsData = action.payload.shipmentsData;
    })
    builder.addCase(stSelectShipment.fulfilled, (state, action) => {
      state.stSelectShipment = action.payload;
    })
  }
})

export default appShipmentSlice.reducer
