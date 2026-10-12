import { TIngredient } from './types';

type TBurgerParts = {
  bun: TIngredient;
  ingredients: TIngredient[];
};

// булка считается дважды: верх и низ
export const getBurgerPrice = ({ bun, ingredients }: TBurgerParts): number =>
  bun.price * 2 + ingredients.reduce((sum, item) => sum + item.price, 0);

// состав в том виде, в каком он уходит в заказ: булка первой и последней
export const getBurgerIngredientIds = ({
  bun,
  ingredients
}: TBurgerParts): string[] => [
  bun._id,
  ...ingredients.map((item) => item._id),
  bun._id
];

export const getBurgerComposition = ({
  bun,
  ingredients
}: TBurgerParts): string =>
  Array.from(
    new Set([bun, ...ingredients].map((item) => item.name.toLowerCase()))
  ).join(', ');
