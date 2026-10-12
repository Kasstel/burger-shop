import React, { FC, memo } from 'react';
import { FormattedDate } from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

import { OrderInfoUIProps } from './type';
import { OrderProgress } from '@components';
import { Currency } from '../currency';

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(({ orderInfo }) => {
  const { delivery, comment } = orderInfo;
  const deliveryText =
    delivery?.type === 'delivery'
      ? ['Доставка', delivery.address, delivery.phone]
          .filter(Boolean)
          .join(', ')
      : 'Самовывоз';

  return (
    <div className={styles.wrap}>
      <h3 className={`text text_type_main-medium pb-4 pt-4 ${styles.header}`}>
        {orderInfo.name}
      </h3>
      <OrderProgress order={orderInfo} />
      <p className='text text_type_main-default text_color_inactive pt-4'>
        {deliveryText}
      </p>
      {comment && (
        <p className='text text_type_main-default text_color_inactive pt-1'>
          Комментарий: {comment}
        </p>
      )}
      <p className={`text text_type_main-medium pt-6 pb-4`}>Состав:</p>
      <ul className={`${styles.list} mb-6`}>
        {Object.values(orderInfo.ingredientsInfo).map((item, index) => (
          <li className={`pb-4 pr-6 ${styles.item}`} key={index}>
            <div className={styles.img_wrap}>
              <div className={styles.border}>
                <img
                  className={styles.img}
                  src={item.image_mobile}
                  alt={item.name}
                />
              </div>
            </div>
            <span className='text text_type_main-default pl-4'>
              {item.name}
            </span>
            <span
              className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
            >
              {item.count} x {item.price}
            </span>
            <Currency />
          </li>
        ))}
      </ul>
      <div className={styles.bottom}>
        <p className='text text_type_main-default text_color_inactive'>
          <FormattedDate date={orderInfo.date} />
        </p>
        <span className={`text text_type_digits-default pr-4 ${styles.total}`}>
          {orderInfo.total}
        </span>
        <Currency />
      </div>
    </div>
  );
});
