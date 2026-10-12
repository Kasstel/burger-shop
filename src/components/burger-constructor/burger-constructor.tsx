import { FC, useEffect, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../slices/burgerConstructorSlice';
import { addToCart } from '../../slices/cartSlice';

export const constructorIngredients = (state: RootState) =>
  state.burgerConstructor;

const OWN_BURGER_NAME = 'Свой бургер';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(constructorIngredients);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const isEmpty =
    !constructorItems.bun && constructorItems.ingredients.length === 0;

  // ссылка на корзину пропадает, как только начали собирать следующий бургер
  useEffect(() => {
    if (!isEmpty) setIsAddedToCart(false);
  }, [isEmpty]);

  const onAddToCart = () => {
    if (!constructorItems.bun) return;
    dispatch(
      addToCart({
        name: constructorItems.name ?? OWN_BURGER_NAME,
        bun: constructorItems.bun,
        ingredients: constructorItems.ingredients
      })
    );
    dispatch(clearConstructor());
    setIsAddedToCart(true);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      constructorItems={constructorItems}
      isAddedToCart={isAddedToCart}
      onAddToCart={onAddToCart}
    />
  );
};
