
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Create Redux slice
const returnExchangeSlice = createSlice({
  name: 'returnExchange',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setData, setLoading, setError } = returnExchangeSlice.actions;

export const store = configureStore({
  reducer: {
    returnExchange: returnExchangeSlice.reducer,
  },
});
