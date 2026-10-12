import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';
import { MenuUI } from '@ui-pages';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { ingredientsSelector } from '../../slices/ingredientsSlice';
import { setBurger } from '../../slices/burgerConstructorSlice';
import { addToCart } from '../../slices/cartSlice';
import { burgers } from '../../data/burgers';
import { getBurgerPrice } from '../../utils/burger';

const ADDED_LABEL_MS = 1500;

export const Menu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ingredients: TIngredient[] = useSelector(ingredientsSelector);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    if (!addedId) return;
    const timer = setTimeout(() => setAddedId(null), ADDED_LABEL_MS);
    return () => clearTimeout(timer);
  }, [addedId]);

  const menu = useMemo(
    () =>
      burgers.reduce(
        (
          acc: {
            id: string;
            name: string;
            description: string;
            image: string;
            badge?: string;
            price: number;
            bun: TIngredient;
            fillings: TIngredient[];
          }[],
          burger
        ) => {
          const [bun, ...fillings] = burger.ingredients.reduce(
            (parts: TIngredient[], id: string) => {
              const ingredient = ingredients.find((item) => item._id === id);
              return ingredient ? [...parts, ingredient] : parts;
            },
            []
          );
          // бургер без булки собрать нельзя — такой рецепт в меню не показываем
          if (!bun || bun.type !== 'bun') return acc;
          const parts = { bun, ingredients: fillings };
          return [
            ...acc,
            {
              id: burger.id,
              name: burger.name,
              description: burger.description,
              image: burger.image,
              badge: burger.badge,
              price: getBurgerPrice(parts),
              bun,
              fillings
            }
          ];
        },
        []
      ),
    [ingredients]
  );

  const findBurger = (id: string) => {
    const burger = menu.find((item) => item.id === id);
    return (
      burger && {
        name: burger.name,
        bun: burger.bun,
        ingredients: burger.fillings
      }
    );
  };

  const handleAddToCart = (id: string) => {
    const burger = findBurger(id);
    if (!burger) return;
    dispatch(addToCart(burger));
    setAddedId(id);
  };

  const handleCustomize = (id: string) => {
    const burger = findBurger(id);
    if (!burger) return;
    dispatch(setBurger(burger));
    navigate('/constructor');
  };

  if (!ingredients.length) {
    return <Preloader />;
  }

  return (
    <MenuUI
      burgers={menu}
      addedId={addedId}
      onAddToCart={handleAddToCart}
      onCustomize={handleCustomize}
    />
  );
};
