import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  BurgerConstructorState,
  selectBurgerConstructor
} from '../src/services/slices/burgerConstructorSlice';

const initialState: BurgerConstructorState = {
  bun: { _id: '', price: 0 },
  ingredients: []
};

const bunIngredient = {
  id: '1',
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
};

const mainIngredient1 = {
  id: '2',
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
};

const mainIngredient2 = {
  id: '3',
  _id: 'main1',
  name: 'Мясо бессмертных',
  type: 'main',
  price: 300,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  calories: 2674,
  carbohydrates: 300,
  fat: 800,
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
  image_mobile: 'image-mobile-url',
  proteins: 800
};
describe('burgerConstructorSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('должен обрабатывать добавление булки', () => {
    const nextState = reducer(initialState, addIngredient(bunIngredient));
    expect(nextState.bun).toEqual(bunIngredient);
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать добавление основной начинки', () => {
    const nextState = reducer(initialState, addIngredient(mainIngredient1));
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toEqual(mainIngredient1);
    expect(nextState.bun).toEqual(initialState.bun);
  });

  it('должен обрабатывать удаление ингредиента по индексу', () => {
    const stateWithIngredients: BurgerConstructorState = {
      bun: initialState.bun,
      ingredients: [mainIngredient1, mainIngredient2]
    };

    const nextState = reducer(stateWithIngredients, removeIngredient(0));
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toEqual(mainIngredient2);
  });

  it('должен обрабатывать изменение порядка ингредиентов', () => {
    const stateWithIngredients: BurgerConstructorState = {
      bun: initialState.bun,
      ingredients: [mainIngredient1, mainIngredient2]
    };

    const nextState = reducer(
      stateWithIngredients,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(nextState.ingredients[0]).toEqual(mainIngredient2);
    expect(nextState.ingredients[1]).toEqual(mainIngredient1);
  });

  it('должен очищать конструктор', () => {
    const filledState: BurgerConstructorState = {
      bun: bunIngredient,
      ingredients: [mainIngredient1]
    };

    const nextState = reducer(filledState, clearConstructor());

    expect(nextState).toEqual(initialState);
  });
});

describe('Селектор selectBurgerConstructor', () => {
  it('selectBurgerConstructor должен возвращать текущее состояние конструктора бургера', () => {
    const nextState = reducer(initialState, addIngredient(bunIngredient));
    const nextState2 = reducer(nextState, addIngredient(mainIngredient1));
    const mockRootState = { burgerConstructor: nextState2 };
    const result = selectBurgerConstructor(mockRootState);
    expect(result).toEqual(nextState2);
  });
});
