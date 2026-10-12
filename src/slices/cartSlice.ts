import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TCartItem } from '@utils-types';
import { nanoid } from 'nanoid';

interface CartState {
  items: TCartItem[];
}

const initialState: CartState = {
  items: []
};

type TNewCartItem = Omit<TCartItem, 'id' | 'count'>;

// одинаковые по составу бургеры складываются в одну строку корзины
const getSignature = (item: TNewCartItem) =>
  [item.bun._id, ...item.ingredients.map((ingredient) => ingredient._id)].join(
    '|'
  );

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: {
      reducer: (state, action: PayloadAction<TCartItem>) => {
        const signature = getSignature(action.payload);
        const same = state.items.find(
          (item) => getSignature(item) === signature
        );
        if (same) {
          same.count += 1;
        } else {
          state.items.push(action.payload);
        }
      },
      prepare: (item: TNewCartItem) => ({
        payload: { ...item, id: nanoid(), count: 1 }
      })
    },
    changeCount: (
      state,
      action: PayloadAction<{ id: string; delta: number }>
    ) => {
      const item = state.items.find(({ id }) => id === action.payload.id);
      if (!item) return;
      item.count += action.payload.delta;
      if (item.count <= 0) {
        state.items = state.items.filter(({ id }) => id !== item.id);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(({ id }) => id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
  selectors: {
    cartItemsSelector: (state) => state.items,
    cartCountSelector: (state) =>
      state.items.reduce((sum, item) => sum + item.count, 0)
  }
});

export const { addToCart, changeCount, removeFromCart, clearCart } =
  cartSlice.actions;

export const { cartItemsSelector, cartCountSelector } = cartSlice.selectors;

export default cartSlice.reducer;
