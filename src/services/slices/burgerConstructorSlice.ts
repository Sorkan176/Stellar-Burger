import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export interface BurgerConstructorState {
  bun: TConstructorIngredient | { _id: ''; price: 0 };
  ingredients: TConstructorIngredient[];
}

const initialState: BurgerConstructorState = {
  bun: {
    _id: '',
    price: 0
  },
  ingredients: []
};

/** Слайс для хранения собранного бургера */
const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const item = action.payload;
      if (item.type === 'bun') {
        state.bun = item;
      } else {
        state.ingredients.push(item);
      }
    },
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    clearConstructor: (state) => {
      state.bun = {
        _id: '',
        price: 0
      };
      state.ingredients = [];
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, moved);
    }
  },
  selectors: {
    /** Селектор, возвращающий текущую сборку бургера: bum и ingredients */
    selectBurgerConstructor: (burgerConstructorState) => burgerConstructorState
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const { selectBurgerConstructor } = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
