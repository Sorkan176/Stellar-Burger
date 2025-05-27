import reducer, {
  fetchLogin,
  fetchRegister,
  fetchUser,
  fetchUpdate,
  fetchLogout,
  selectUser, selectUserLoading
} from '../src/services/slices/userSlice';
import { TUser } from '../src/utils/types';
import { TAuthResponse, TUserResponse } from '../src/utils/burger-api';

const initialState = {
  user: { email: '', name: '' },
  password: '',
  isLoading: false,
  error: null
};

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Тест'
};

const createMockState = (partialState: any) => ({
  user: {
    ...initialState,
    ...partialState
  }
});

jest.mock('../src/utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

beforeAll(() => {
  const localStorageMock = (function () {
    let store: Record<string, string> = {};

    return {
      getItem(key: string) {
        return store[key] || null;
      },
      setItem(key: string, value: string) {
        store[key] = value;
      },
      removeItem(key: string) {
        delete store[key];
      },
      clear() {
        store = {};
      }
    };
  })();

  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock
  });
});

describe('userSlice reducer', () => {
  it('pending fetchLogin — isLoading = true', () => {
    const state = reducer(initialState, { type: fetchLogin.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled fetchLogin — сохраняет пользователя и сбрасывает isLoading', () => {
    const payload: TAuthResponse = {
      success: true,
      user: mockUser,
      accessToken: 'access-token',
      refreshToken: 'refresh-token'
    };

    const state = reducer(initialState, {
      type: fetchLogin.fulfilled.type,
      payload
    });

    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('rejected fetchLogin — сохраняет ошибку', () => {
    const state = reducer(initialState, {
      type: fetchLogin.rejected.type,
      error: { message: 'Ошибка входа' }
    });

    expect(state.error).toBe('Ошибка входа');
    expect(state.isLoading).toBe(false);
  });

  it('устанавливает "Unknown error", если сообщение об ошибке отсутствует при fetchLogin.rejected', () => {
    const action = {
      type: fetchLogin.rejected.type,
      error: {}
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe('Unknown error');
  });

  it('fulfilled fetchUser — сохраняет пользователя и isLoading = false', () => {
    const payload: TUserResponse = {
      success: true,
      user: mockUser
    };

    const state = reducer(initialState, {
      type: fetchUser.fulfilled.type,
      payload
    });

    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
  });

  it('fulfilled fetchLogout — очищает пользователя', () => {
    const stateWithUser = {
      ...initialState,
      user: mockUser
    };

    const state = reducer(stateWithUser, {
      type: fetchLogout.fulfilled.type
    });

    expect(state.user).toEqual(initialState.user);
    expect(state.isLoading).toBe(false);
  });

  it('fulfilled fetchRegister - регистрирует пользователя в системе и сохраняет его данные в сторе', () => {
    const mockPayload = {
      user: { email: 'test@example.com', name: 'Test User' },
      accessToken: 'testAccess',
      refreshToken: 'testRefresh'
    };

    const action = {
      type: fetchRegister.fulfilled.type,
      payload: mockPayload
    };

    const nextState = reducer(initialState, action);

    expect(nextState.user).toEqual(mockPayload.user);
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  it('fulfilled fetchUpdate - обновляет данные пользователя в приложении', () => {
    const mockPayload = {
      user: { email: 'updated@example.com', name: 'Updated User' }
    };

    const action = {
      type: fetchUpdate.fulfilled.type,
      payload: mockPayload
    };

    const nextState = reducer(initialState, action);

    expect(nextState.user).toEqual(mockPayload.user);
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBeNull();
  });
});

describe('Селекторы UserSlice', () => {
  it('selectUser должен вернуть данные пользователя', () => {
    const state = createMockState({ user: mockUser });
    const result = selectUser(state);
    expect(result).toEqual(mockUser);
  });

  it('selectUserLoading должен вернуть состояние загрузки пользователя', () => {
    const state = createMockState({});
    const result = selectUserLoading(state);
    expect(result).toBe(false);
  });
});
