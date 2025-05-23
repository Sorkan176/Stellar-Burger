import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi, TNewOrderResponse } from '@api';
const API_URL = process.env.BURGER_API_URL;

interface OrderState {
  isLoading: boolean;
  myOrders: TOrder[];
  orderModalData: TOrder | null;
}

const initialState: OrderState = {
  isLoading: false,
  myOrders: [],
  orderModalData: null
};

/** Отправить на сервер заказ */
export const fetchOrder = createAsyncThunk<TNewOrderResponse, string[]>(
  `${API_URL}/order`,
  async (ingredients) => await orderBurgerApi(ingredients)
);

export const fetchMyOrders = createAsyncThunk<TOrder[]>(
  `${API_URL}/orders`,
  async () => await getOrdersApi()
);

/** Слайс, хранящий данные моих заказов */
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModalAction: (state) => {
      state.orderModalData = null; // закрываем модалку
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload.order; // <-- показываем модалку
        state.myOrders.push(action.payload.order);
      })
      .addCase(fetchOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchMyOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.myOrders = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchMyOrders.rejected, (state) => {
        state.isLoading = false;
      });
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData,
    selectMyOrders: (state) => state.myOrders,
    selectIsMyOrdersLoading: (state) => state.isLoading
  }
});

export const { selectOrderModalData, selectIsMyOrdersLoading, selectMyOrders } =
  orderSlice.selectors;
export const { closeOrderModalAction } = orderSlice.actions;

export default orderSlice.reducer;
