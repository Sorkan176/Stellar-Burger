import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
const API_URL = process.env.BURGER_API_URL;

interface IngredientListState {
  ingredients: TIngredient[];
  isLoading: boolean;
  isLoaded: boolean;
}

const initialState: IngredientListState = {
  ingredients: [],
  isLoading: true,
  isLoaded: false
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  `${API_URL}/ingredients`,
  async () => await getIngredientsApi()
);

/** Слайс для хранения всех доступных ингредиентов */
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (sliceState) =>
      sliceState.ingredients || initialState.ingredients,
    selectIsLoading: (sliceState) => sliceState.isLoading,
    selectIsLoaded: (sliceState) => sliceState.isLoaded
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.isLoaded = false;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredients = action.payload;
          state.isLoading = false;
          state.isLoaded = true;
        }
      )
      .addCase(fetchIngredients.rejected, (state) => {
        state.isLoading = false;
        state.isLoaded = false;
      });
  }
});

export const { selectIngredients, selectIsLoading, selectIsLoaded } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
