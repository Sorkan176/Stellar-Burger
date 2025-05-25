import reducer, {
  fetchOrder,
  fetchMyOrders,
  closeOrderModalAction,
  selectOrderModalData,
  selectMyOrders,
  selectIsMyOrdersLoading, clearMyOrders
} from '../src/services/slices/myOrdersSlice';
import { TOrder } from '../src/utils/types';

const initialState = {
  isLoading: false,
  myOrders: [],
  orderModalData: null,
  error: null
};

const mockOrder: TOrder = {
  _id: '123',
  ingredients: ['1', '2'],
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2023-05-01',
  updatedAt: '2023-05-01',
  number: 123
};

const createMockState = (partialState: any) => ({
  myOrders: {
    ...initialState,
    ...partialState
  }
});

describe('myOrdersSlice reducer', () => {
  it('должен установить isLoading в true при fetchOrder.pending', () => {
    const action = { type: fetchOrder.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен добавить заказ и выключить isLoading при fetchOrder.fulfilled', () => {
    const action = {
      type: fetchOrder.fulfilled.type,
      payload: { order: mockOrder }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.myOrders).toContainEqual(mockOrder);
  });

  it('должен установить ошибку при fetchOrder.rejected', () => {
    const action = {
      type: fetchOrder.rejected.type,
      error: { message: 'Ошибка заказа' }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка заказа');
  });

  it('должен установить "Unknown error", если сообщение об ошибке отсутствует при fetchOrder.rejected', () => {
    const action = {
      type: fetchOrder.rejected.type,
      error: {}
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe('Unknown error');
  });

  it('должен установить isLoading в true при fetchMyOrders.pending', () => {
    const action = { type: fetchMyOrders.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен записать массив заказов при fetchMyOrders.fulfilled', () => {
    const action = {
      type: fetchMyOrders.fulfilled.type,
      payload: [mockOrder]
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.myOrders).toEqual([mockOrder]);
  });

  it('должен установить ошибку при fetchMyOrders.rejected', () => {
    const action = {
      type: fetchMyOrders.rejected.type,
      error: { message: 'Ошибка получения заказов' }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка получения заказов');
  });

  it('должен установить "Unknown error", если сообщение об ошибке отсутствует при fetchMyOrders.rejected', () => {
    const action = {
      type: fetchMyOrders.rejected.type,
      error: {}
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe('Unknown error');
  });

  it('должен закрыть модальное окно заказа при closeOrderModalAction', () => {
    const modifiedState = {
      ...initialState,
      orderModalData: mockOrder
    };
    const state = reducer(modifiedState, closeOrderModalAction());
    expect(state.orderModalData).toBeNull();
  });

  it('должен очистить заказы пользователя', () => {
    const modifiedState = {
      ...initialState,
      myOrders: [mockOrder]
    };
    const state = reducer(modifiedState, clearMyOrders());
    expect(state).toEqual(initialState);
  })
});

describe('Селекторы MyOrdersSlice', () => {
  it('selectOrderModalData должен вернуть данные заказа в модалке', () => {
    const state = createMockState({ orderModalData: mockOrder });
    const result = selectOrderModalData(state);
    expect(result).toEqual(mockOrder);
  });

  it('selectOrderModalData должен вернуть null, если модалка неактивна', () => {
    const state = createMockState({ orderModalData: null });
    const result = selectOrderModalData(state);
    expect(result).toBeNull();
  });

  it('selectMyOrders должен вернуть список заказов', () => {
    const state = createMockState({ myOrders: [mockOrder] });
    const result = selectMyOrders(state);
    expect(result).toEqual([mockOrder]);
  });

  it('selectIsMyOrdersLoading должен вернуть true, если заказы загружаются', () => {
    const state = createMockState({ isLoading: true });
    const result = selectIsMyOrdersLoading(state);
    expect(result).toBe(true);
  });
});
