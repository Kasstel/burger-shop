import { TOrder } from '@utils-types';

export type OrderDetailsUIProps = {
  orderNumber: number;
  // если заказ передан, вместо текста показывается его прогресс
  order?: TOrder;
};
