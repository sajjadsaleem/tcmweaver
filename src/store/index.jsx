// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit';

// ** Reducers
import stAuth from './apps/auth';
import stShipment from './apps/shipment';
import stUsers from './apps/users';
// import { AppDispatch, RootState } from './types';

export const store = configureStore({
  reducer: {
    stAuth,
    stShipment,
    stUsers,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

// rest of your code
