import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi, TNewOrderResponse } from '@api';
const API_URL = process.env.BURGER_API_URL;

interface MyOrdersState {
  isLoading: boolean;
  myOrders: TOrder[];
  orderModalData: TOrder | null;
  error: string | null;
}

export const initialState: MyOrdersState = {
  isLoading: false,
  myOrders: [],
  orderModalData: null,
  error: null
};

/** Отправить на сервер заказ */
export const fetchOrder = createAsyncThunk<TNewOrderResponse, string[]>(
  `${API_URL}/order`,
  async (ingredients) => await orderBurgerApi(ingredients)
);
/** Получить мои заказы */
export const fetchMyOrders = createAsyncThunk<TOrder[]>(
  `${API_URL}/orders`,
  async () => await getOrdersApi()
);

/** Слайс, хранящий данные моих заказов */
const MyOrdersSlice = createSlice({
  name: 'myOrders',
  initialState,
  reducers: {
    closeOrderModalAction: (state) => {
      state.orderModalData = null; // закрываем модалку
    },
    clearMyOrders: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload.order; // показываем модалку
        state.myOrders.push(action.payload.order);
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Unknown error';
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchMyOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.myOrders = action.payload;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Unknown error';
      });
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData,
    selectMyOrders: (state) => state.myOrders,
    selectIsMyOrdersLoading: (state) => state.isLoading
  }
});

export const { selectOrderModalData, selectIsMyOrdersLoading, selectMyOrders } =
  MyOrdersSlice.selectors;
export const { closeOrderModalAction, clearMyOrders } = MyOrdersSlice.actions;

export default MyOrdersSlice.reducer;
