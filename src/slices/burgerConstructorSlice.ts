import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { nanoid } from 'nanoid';

interface ConstructorState {
  // название готового бургера из меню; сбрасывается, как только состав изменили
  name: string | null;
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  name: null,
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else if (ingredient.type === 'sauce' || ingredient.type === 'main') {
          state.ingredients.push(ingredient);
        }
        state.name = null;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },
    setBurger: {
      reducer: (state, action: PayloadAction<ConstructorState>) =>
        action.payload,
      prepare: (burger: {
        name: string;
        bun: TIngredient;
        ingredients: TIngredient[];
      }) => ({
        payload: {
          name: burger.name,
          bun: burger.bun,
          ingredients: burger.ingredients.map((ingredient) => ({
            ...ingredient,
            id: nanoid()
          }))
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const ingredientId = action.payload;
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== ingredientId
      );
      state.name = null;
    },
    removeBun: (state) => {
      state.bun = null;
      state.name = null;
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedIngredient);
      state.name = null;
    },
    clearConstructor: () => initialState
  },
  selectors: {
    getBun: (state) => state.bun,
    getIngredients: (state) => state.ingredients
  }
});
export const {
  addIngredient,
  setBurger,
  removeIngredient,
  removeBun,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const { getBun, getIngredients } = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
