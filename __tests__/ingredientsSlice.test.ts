import reducer, {
  fetchIngredients,
  selectIngredients,
  selectIsLoading,
  selectIsLoaded
} from '../src/services/slices/ingredientsSlice';
import { TIngredient } from '../src/utils/types';

const initialState = {
  ingredients: [],
  isLoading: true,
  isLoaded: false,
  error: null
};

const createMockState = (partialState: any) => ({
  ingredients: {
    ...initialState,
    ...partialState
  }
});

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun1',
    name: 'Булка N-200i',
    type: 'bun',
    price: 50,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    calories: 420,
    carbohydrates: 53,
    fat: 24,
    proteins: 80,
    image_mobile: 'image-mobile-url'
  },
  {
    _id: 'sauce1',
    name: 'Соус Space',
    type: 'sauce',
    price: 20,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    calories: 30,
    carbohydrates: 40,
    fat: 20,
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'image-mobile-url',
    proteins: 30
  }
];

describe('ingredientsSlice reducer', () => {
  it('должен установить isLoading в true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.isLoaded).toBe(false);
  });

  it('должен записать ингредиенты и установить isLoading в false при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.isLoaded).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен записать ошибку и установить isLoading в false при fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.isLoaded).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('устанавливает "Unknown error", если сообщение об ошибке отсутствует при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: {}
    };
    const state = reducer(initialState, action);
    expect(state.error).toBe('Unknown error');
  });
});

describe('Селекторы ingredientsSlice', () => {
  it('selectIngredients должен вернуть массив ингредиентов', () => {
    const state = createMockState({ ingredients: mockIngredients });
    const result = selectIngredients(state);
    expect(result).toEqual(mockIngredients);
  });

  it('selectIngredients должен вернуть initialState.ingredients, если ingredients undefined', () => {
    const state = createMockState({ ingredients: undefined });
    const result = selectIngredients(state);
    expect(result).toEqual(initialState.ingredients);
  });

  it('selectIsLoading должен вернуть true, если загрузка активна', () => {
    const state = createMockState({ isLoading: true });
    const result = selectIsLoading(state);
    expect(result).toBe(true);
  });

  it('selectIsLoaded должен вернуть true, если загрузка завершена', () => {
    const state = createMockState({ isLoaded: true });
    const result = selectIsLoaded(state);
    expect(result).toBe(true);
  });
});
