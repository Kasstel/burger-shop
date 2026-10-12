import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { RootState, useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], isDone: boolean): number[] =>
  orders
    .filter((item) => (item.status === 'done') === isDone)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(
    (state: RootState) => state.orders
  );

  const readyOrders = getOrders(orders, true);

  const pendingOrders = getOrders(orders, false);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
