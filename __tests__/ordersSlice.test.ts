import reducer, {
  fetchOrders,
  selectOrderList,
  selectTotal,
  selectTotalToday,
  selectIsOrdersLoading,
  selectIsOrdersLoaded
} from '../src/services/slices/ordersSlice';
import { TOrder } from '../src/utils/types';
import { TFeedsResponse } from '../src/utils/burger-api';

const initialState = {
  orders: [],
  isLoading: false,
  isLoaded: false,
  total: 0,
  totalToday: 0,
  error: null
};

const mockOrder: TOrder = {
  _id: 'test-id',
  ingredients: ['123', '456'],
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '2023-05-01',
  updatedAt: '2023-05-01',
  number: 999
};

const mockResponse: TFeedsResponse = {
  success: true,
  orders: [mockOrder],
  total: 1234,
  totalToday: 50
};

const createMockState = (partialState: any) => ({
  orders: {
    ...initialState,
    ...partialState
  }
});

describe('ordersSlice reducer', () => {
  it('должен установить isLoading в true при fetchOrders.pending', () => {
    const state = reducer(initialState, { type: fetchOrders.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обновить заказы при fetchOrders.fulfilled', () => {
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: mockResponse
    };
    const state = reducer(initialState, action);
    expect(state.orders).toEqual([mockOrder]);
    expect(state.total).toBe(1234);
    expect(state.totalToday).toBe(50);
    expect(state.isLoading).toBe(false);
    expect(state.isLoaded).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен установить ошибку при fetchOrders.rejected', () => {
    const action = {
      type: fetchOrders.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.isLoaded).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('должен установить "Unknown error", если сообщение об ошибке отсутствует при fetchOrders.rejected', () => {
    const action = {
      type: fetchOrders.rejected.type,
      error: {}
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe('Unknown error');
  });
});

describe('Селекторы ordersSlice', () => {
  it('selectOrderList должен вернуть список заказов', () => {
    const state = createMockState({ orders: mockResponse.orders });
    const result = selectOrderList(state);
    expect(result).toEqual([mockOrder]);
  });

  it('selectTotal должен вернуть общее количество заказов', () => {
    const state = createMockState({ total: mockResponse.total });
    const result = selectTotal(state);
    expect(result).toBe(1234);
  });

  it('selectTotalToday должен вернуть количество заказов за сегодня', () => {
    const state = createMockState({ totalToday: mockResponse.totalToday });
    const result = selectTotalToday(state);
    expect(result).toBe(50);
  });

  it('selectIsOrdersLoading должен вернуть true, если идёт загрузка', () => {
    const state = createMockState({ isLoading: true });
    const result = selectIsOrdersLoading(state);
    expect(result).toBe(true);
  });

  it('selectIsOrdersLoaded должен вернуть true, если данные загружены', () => {
    const state = createMockState({ isLoaded: true });
    const result = selectIsOrdersLoaded(state);
    expect(result).toBe(true);
  });
});
