import React from 'react';
import styles from './order-details.module.css';
import doneImg from '../../../images/done.svg';
import { OrderDetailsUIProps } from './type';
import { OrderProgress } from '@components';

export const OrderDetailsUI: React.FC<OrderDetailsUIProps> = ({
  orderNumber,
  order
}) => (
  <>
    <h2 className={`${styles.title} text text_type_digits-large mt-2 mb-4`}>
      {orderNumber}
    </h2>
    <p className='text text_type_main-medium'>номер заказа</p>
    <img
      className={styles.img}
      src={doneImg}
      alt='изображение статуса заказа.'
    />
    {order ? (
      <div className={styles.progress}>
        <OrderProgress order={order} />
      </div>
    ) : (
      <>
        <p className='text text_type_main-default mb-1'>
          Ваш заказ начали готовить
        </p>
        <p className={`${styles.text} text text_type_main-default`}>
          Мы позовём вас, когда он будет готов
        </p>
      </>
    )}
  </>
);
