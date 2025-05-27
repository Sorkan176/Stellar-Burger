import { initialState as ingredientsInitialState } from '../src/services/slices/ingredientsSlice';
import { initialState as burgerConstructorInitialState } from '../src/services/slices/burgerConstructorSlice';
import { initialState as ordersInitialState } from '../src/services/slices/ordersSlice';
import { initialState as myOrdersInitialState } from '../src/services/slices/myOrdersSlice';
import { initialState as userInitialState } from '../src/services/slices/userSlice';

import { rootReducer } from '../src/services/store';

describe('rootReducer', () => {
  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: burgerConstructorInitialState,
      orders: ordersInitialState,
      myOrders: myOrdersInitialState,
      user: userInitialState
    });
  });
});
