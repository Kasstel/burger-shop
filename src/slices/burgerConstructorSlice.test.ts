import { TConstructorIngredient, TIngredient } from '@utils-types';
import reducer, {
  addIngredient,
  setBurger,
  removeIngredient,
  removeBun,
  moveIngredient,
  clearConstructor
} from './burgerConstructorSlice';
import { nanoid } from '@reduxjs/toolkit';

const bun: TIngredient = {
  _id: 'bun1',
  type: 'bun',
  name: 'Булка',
  proteins: 10,
  fat: 5,
  carbohydrates: 3,
  calories: 100,
  price: 50,
  image: 'url',
  image_mobile: 'url',
  image_large: 'url'
};
const sauce: TIngredient = {
  _id: 'sauce1',
  type: 'sauce',
  name: 'Соус',
  proteins: 10,
  fat: 5,
  carbohydrates: 3,
  calories: 100,
  price: 50,
  image: 'url',
  image_mobile: 'url',
  image_large: 'url'
};
const main: TIngredient = {
  _id: 'main1',
  type: 'main',
  name: 'Мясо',
  proteins: 10,
  fat: 5,
  carbohydrates: 3,
  calories: 100,
  price: 50,
  image: 'url',
  image_mobile: 'url',
  image_large: 'url'
};

const mockIngredient = (): TConstructorIngredient => ({
  _id: '123',
  id: nanoid(),
  type: 'main',
  name: 'Тест ингредиент',
  proteins: 10,
  fat: 5,
  carbohydrates: 3,
  calories: 100,
  price: 50,
  image: 'url',
  image_mobile: 'url',
  image_large: 'url'
});

describe('burgerConstructorSlice', () => {
  it('должен добавить булку', () => {
    const state = reducer(undefined, addIngredient(bun));
    expect(state.bun).toEqual(expect.objectContaining(bun));
  });

  it('должен добавить ингредиент (sauce/main)', () => {
    const state1 = reducer(undefined, addIngredient(sauce));
    expect(state1.ingredients.length).toBe(1);

    const state2 = reducer(state1, addIngredient(main));
    expect(state2.ingredients.length).toBe(2);
  });

  it('должен удалить ингредиент', () => {
    const first = mockIngredient();
    const second = mockIngredient();
    const startState = {
      name: null,
      bun: null,
      ingredients: [first, second]
    };
    const state = reducer(startState, removeIngredient('unknown'));
    expect(state.ingredients).toHaveLength(2);

    // одинаковые ингредиенты удаляются по одному
    const state2 = reducer(startState, removeIngredient(first.id));
    expect(state2.ingredients).toEqual([second]);
  });

  it('должен удалить булку', () => {
    const state = reducer(
      { name: null, bun, ingredients: [mockIngredient()] },
      removeBun()
    );
    expect(state.bun).toBeNull();
  });

  it('должен переместить ингредиент', () => {
    const startState = {
      name: null,
      bun: null,
      ingredients: [
        { ...main, id: '1' },
        { ...sauce, id: '2' }
      ]
    };

    const state = reducer(
      startState,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );
    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });

  it('должен очищать конструктор', () => {
    const startState = {
      name: 'Чизбургер',
      bun,
      ingredients: [mockIngredient()]
    };
    const state = reducer(startState, clearConstructor());
    expect(state).toEqual({ name: null, bun: null, ingredients: [] });
  });

  it('загружает готовый бургер и забывает его название после правки', () => {
    const loaded = reducer(
      undefined,
      setBurger({ name: 'Чизбургер', bun, ingredients: [main, main] })
    );
    expect(loaded.name).toBe('Чизбургер');
    expect(loaded.bun).toEqual(bun);
    expect(loaded.ingredients).toHaveLength(2);
    expect(loaded.ingredients[0].id).not.toBe(loaded.ingredients[1].id);

    const changed = reducer(loaded, addIngredient(sauce));
    expect(changed.name).toBeNull();
  });
});
