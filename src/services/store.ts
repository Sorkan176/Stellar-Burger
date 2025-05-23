import { configureStore } from '@reduxjs/toolkit';
import ingredients from './slices/ingredientsSlice';
import burgerConstructor from './slices/burgerConstructorSlice';
import orders from './slices/ordersSlice';
import user from './slices/userSlice';
import order from './slices/orderSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const store = configureStore({
  reducer: {
    ingredients: ingredients,
    burgerConstructor: burgerConstructor,
    orders: orders,
    order: order,
    user: user
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
