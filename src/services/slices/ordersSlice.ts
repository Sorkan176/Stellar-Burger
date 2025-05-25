import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, TFeedsResponse } from '@api';
const API_URL = process.env.BURGER_API_URL;

interface orderList {
  orders: TOrder[];
  isLoading: boolean;
  isLoaded: boolean;
  total: number;
  totalToday: number;
  error: string | null;
}

export const initialState: orderList = {
  orders: [],
  isLoading: false,
  isLoaded: false,
  total: 0,
  totalToday: 0,
  error: null
};

export const fetchOrders = createAsyncThunk<TFeedsResponse>(
  `${API_URL}/orders/all`,
  async () => await getFeedsApi()
);

/** Слайс для хранения всех заказов */
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.orders = action.payload.orders;
          state.isLoading = false;
          state.isLoaded = true;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.error = null;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoaded = false;
        state.error = action.error.message || 'Unknown error';
      });
  },
  selectors: {
    selectOrderList: (orderState) => orderState.orders,
    selectTotal: (orderState) => orderState.total,
    selectTotalToday: (orderState) => orderState.totalToday,
    selectIsOrdersLoading: (orderState) => orderState.isLoading,
    selectIsOrdersLoaded: (orderState) => orderState.isLoaded
  }
});

export const {
  selectOrderList,
  selectTotal,
  selectTotalToday,
  selectIsOrdersLoading,
  selectIsOrdersLoaded
} = ordersSlice.selectors;

export default ordersSlice.reducer;
