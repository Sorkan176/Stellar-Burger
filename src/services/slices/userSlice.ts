import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  TUserResponse,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';
const API_URL = process.env.BURGER_API_URL;

interface UserData {
  user: TUser;
  password: string;
  isLoading: boolean;
}

const initialState: UserData = {
  user: {
    email: '',
    name: ''
  },
  password: '',
  isLoading: false
};

export const fetchLogin = createAsyncThunk<
  TAuthResponse, // тип данных, которые вернёт thunk
  TLoginData // тип аргумента, который передаём в dispatch
>(`${API_URL}/auth/login`, async (loginData) => await loginUserApi(loginData));

export const fetchRegister = createAsyncThunk<TAuthResponse, TRegisterData>(
  `${API_URL}/auth/register`,
  async (registerData) => await registerUserApi(registerData)
);

export const fetchUpdate = createAsyncThunk<TUserResponse, TRegisterData>(
  `${API_URL}/auth/user`,
  async (updateData) => await updateUserApi(updateData)
);

export const fetchLogout = createAsyncThunk(
  `${API_URL}/auth/logout`,
  async () => await logoutApi()
);

export const fetchUser = createAsyncThunk<TUserResponse>(
  `${API_URL}/auth/user`,
  async () => await getUserApi()
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogout.fulfilled, (state) => {
        state.user = initialState.user;
        state.password = '';
        state.isLoading = true;
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
      })
      .addMatcher(
        (
          action
        ): action is ReturnType<
          typeof fetchUpdate.fulfilled | typeof fetchUser.fulfilled
        > =>
          action.type === fetchUpdate.fulfilled.type ||
          action.type === fetchUser.fulfilled.type,
        (state, action) => {
          const { user } = action.payload;
          state.user = user;
          state.isLoading = false;
        }
      )
      .addMatcher(
        (
          action
        ): action is ReturnType<
          | typeof fetchLogin.pending
          | typeof fetchRegister.pending
          | typeof fetchUpdate.pending
          | typeof fetchLogout.pending
          | typeof fetchUser.pending
        > =>
          action.type === fetchLogin.pending.type ||
          action.type === fetchRegister.pending.type ||
          action.type === fetchUpdate.pending.type ||
          action.type === fetchLogout.pending.type ||
          action.type === fetchUser.pending.type,
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (
          action
        ): action is ReturnType<
          typeof fetchLogin.fulfilled | typeof fetchRegister.fulfilled
        > =>
          action.type === fetchLogin.fulfilled.type ||
          action.type === fetchRegister.fulfilled.type,
        (state, action) => {
          const { user, refreshToken, accessToken } = action.payload;
          state.user = user;
          setCookie('accessToken', accessToken, { expires: 60 * 60 }); // 60 мин
          // setCookie('refreshToken', refreshToken, { expires: 30 * 24 * 3600 }); // 30 дней
          localStorage.setItem('refreshToken', refreshToken);
          state.isLoading = false;
        }
      )
      .addMatcher(
        (
          action
        ): action is ReturnType<
          | typeof fetchLogin.rejected
          | typeof fetchRegister.rejected
          | typeof fetchUpdate.rejected
          | typeof fetchUser.rejected
          | typeof fetchLogout.rejected
        > =>
          action.type === fetchLogin.rejected.type ||
          action.type === fetchRegister.rejected.type ||
          action.type === fetchUpdate.rejected.type ||
          action.type === fetchUser.rejected.type ||
          action.type === fetchLogout.rejected.type,
        (state, action) => {
          state.isLoading = false;
          console.log('ERROR ', action.error);
        }
      );
  },
  selectors: {
    /** Селектор возвращающий данные пользователя: email и имя*/
    selectUser: (userState) => userState.user
  }
});

export const { selectUser } = userSlice.selectors;

export default userSlice.reducer;
