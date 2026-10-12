import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearSelectedOrder,
  getOrderByNumberAsync,
  orderModalSelector
} from '../../slices/orderSlice';
import { ingredientsSelector } from '../../slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const orderData = useSelector(orderModalSelector);
  const dispatch = useDispatch();
  const ingredients: TIngredient[] = useSelector(ingredientsSelector);

  const { number } = useParams();

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumberAsync(Number(number)));
    }
    // иначе просмотренный заказ всплывёт в конструкторе как только что оформленный
    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
