import { TIngredient } from '@utils-types';
import reducer, {
  addToCart,
  changeCount,
  removeFromCart,
  clearCart
} from './cartSlice';

const ingredient = (_id: string, type: TIngredient['type']): TIngredient => ({
  _id,
  type,
  name: _id,
  proteins: 10,
  fat: 5,
  carbohydrates: 3,
  calories: 100,
  price: 50,
  image: 'url',
  image_mobile: 'url',
  image_large: 'url'
});

const bun = ingredient('bun1', 'bun');
const main = ingredient('main1', 'main');
const sauce = ingredient('sauce1', 'sauce');

const cheese = { name: 'Чизбургер', bun, ingredients: [main] };
const custom = { name: 'Свой бургер', bun, ingredients: [main, sauce] };

describe('cartSlice', () => {
  it('добавляет бургер в корзину', () => {
    const state = reducer(undefined, addToCart(cheese));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(expect.objectContaining(cheese));
    expect(state.items[0].count).toBe(1);
  });

  it('одинаковые бургеры складывает в одну строку', () => {
    const first = reducer(undefined, addToCart(cheese));
    const second = reducer(first, addToCart(cheese));
    const third = reducer(second, addToCart(custom));
    expect(third.items).toHaveLength(2);
    expect(third.items[0].count).toBe(2);
    expect(third.items[1].count).toBe(1);
  });

  it('меняет количество и убирает строку, когда оно доходит до нуля', () => {
    const start = reducer(undefined, addToCart(cheese));
    const { id } = start.items[0];

    const more = reducer(start, changeCount({ id, delta: 1 }));
    expect(more.items[0].count).toBe(2);

    const less = reducer(more, changeCount({ id, delta: -1 }));
    expect(less.items[0].count).toBe(1);

    const empty = reducer(less, changeCount({ id, delta: -1 }));
    expect(empty.items).toHaveLength(0);
  });

  it('удаляет бургер из корзины', () => {
    const start = reducer(
      reducer(undefined, addToCart(cheese)),
      addToCart(custom)
    );
    const state = reducer(start, removeFromCart(start.items[0].id));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].name).toBe('Свой бургер');
  });

  it('очищает корзину', () => {
    const start = reducer(undefined, addToCart(cheese));
    expect(reducer(start, clearCart())).toEqual({ items: [] });
  });
});
