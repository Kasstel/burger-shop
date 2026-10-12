import { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  CloseIcon,
  Input,
  Tab
} from '@zlden/react-developer-burger-ui-components';

import styles from './cart.module.css';

import { CartUIProps } from './type';
import { TDeliveryType } from '@utils-types';
import { Modal } from '@components';
import { Currency } from '../../currency';
import { OrderDetailsUI } from '../../order-details';
import { Preloader } from '../../preloader';

export const CartUI: FC<CartUIProps> = ({
  items,
  total,
  minutes,
  deliveryType,
  address,
  phone,
  comment,
  errorText,
  orderRequest,
  orderModalData,
  onCountChange,
  onRemove,
  onDeliveryTypeChange,
  setAddress,
  setPhone,
  setComment,
  handleSubmit,
  closeOrderModal
}) => (
  <main className={styles.containerMain}>
    <h1 className='text text_type_main-large mt-10 mb-5'>Корзина</h1>
    {items.length === 0 ? (
      <div className={styles.empty}>
        <p className='text text_type_main-medium mb-6'>В корзине пока пусто</p>
        <Link to='/' className={`${styles.link} text text_type_main-default`}>
          Выбрать бургер в меню
        </Link>
      </div>
    ) : (
      <div className={styles.main}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li
              className={`${styles.item} p-6 mb-4 mr-2`}
              key={item.id}
              data-testid='cart-item'
            >
              <div className={styles.img_wrap}>
                <img className={styles.img} src={item.image} alt='' />
              </div>
              <div className={styles.info}>
                <h2 className='text text_type_main-medium'>{item.name}</h2>
                <p
                  className={`${styles.composition} text text_type_main-default text_color_inactive mt-1`}
                >
                  {item.composition}
                </p>
                <div className={`${styles.controls} mt-3`}>
                  <button
                    className={`${styles.countButton} text text_type_main-medium`}
                    type='button'
                    aria-label='Уменьшить количество'
                    onClick={() => onCountChange(item.id, -1)}
                  >
                    −
                  </button>
                  <span
                    className='text text_type_digits-default'
                    data-testid='cart-item-count'
                  >
                    {item.count}
                  </span>
                  <button
                    className={`${styles.countButton} text text_type_main-medium`}
                    type='button'
                    aria-label='Увеличить количество'
                    onClick={() => onCountChange(item.id, 1)}
                  >
                    +
                  </button>
                  <div className={styles.price}>
                    <span className='text text_type_digits-default mr-2'>
                      {item.price * item.count}
                    </span>
                    <Currency />
                  </div>
                </div>
              </div>
              <button
                className={styles.remove}
                type='button'
                aria-label='Убрать из корзины'
                onClick={() => onRemove(item.id)}
              >
                <CloseIcon type='primary' />
              </button>
            </li>
          ))}
        </ul>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className='text text_type_main-medium mb-4'>Как получить</h2>
          <div className={`${styles.tabs} mb-6`}>
            <Tab
              value='pickup'
              active={deliveryType === 'pickup'}
              onClick={(value) => onDeliveryTypeChange(value as TDeliveryType)}
            >
              Самовывоз
            </Tab>
            <Tab
              value='delivery'
              active={deliveryType === 'delivery'}
              onClick={(value) => onDeliveryTypeChange(value as TDeliveryType)}
            >
              Доставка
            </Tab>
          </div>
          {deliveryType === 'delivery' ? (
            <>
              <div className='pb-6'>
                <Input
                  type='text'
                  placeholder='Адрес доставки'
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  name='address'
                  error={false}
                  errorText=''
                  size='default'
                />
              </div>
              <div className='pb-6'>
                <Input
                  type='text'
                  placeholder='Телефон'
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  name='phone'
                  error={false}
                  errorText=''
                  size='default'
                />
              </div>
            </>
          ) : (
            <p className='text text_type_main-default text_color_inactive pb-6'>
              Заберите заказ на выдаче, когда он будет готов. Назовите номер
              заказа.
            </p>
          )}
          <div className='pb-2'>
            <Input
              type='text'
              placeholder='Комментарий к заказу'
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              name='comment'
              error={false}
              errorText=''
              size='default'
            />
          </div>
          <p
            className={`${styles.hint} text text_type_main-default text_color_inactive pb-6`}
          >
            Например: без лука, соус отдельно
          </p>
          <p className='text text_type_main-default' data-testid='cart-eta'>
            {deliveryType === 'delivery'
              ? `Привезём примерно через ${minutes} мин`
              : `Будет готов примерно через ${minutes} мин`}
          </p>
          {errorText && (
            <p className={`${styles.error} text text_type_main-default mt-4`}>
              {errorText}
            </p>
          )}
          <div className={`${styles.total} mt-6`}>
            <div className={`${styles.cost} mr-10`}>
              <span className={`${styles.sum} mr-2`}>{total}</span>
              <Currency size='large' />
            </div>
            <Button
              htmlType='submit'
              type='primary'
              size='large'
              data-testid='order-button'
            >
              Оформить заказ
            </Button>
          </div>
        </form>
      </div>
    )}

    {orderRequest && (
      <Modal onClose={closeOrderModal} title='Оформляем заказ...'>
        <Preloader />
      </Modal>
    )}

    {orderModalData && (
      <Modal onClose={closeOrderModal} title=''>
        <OrderDetailsUI
          orderNumber={orderModalData.number}
          order={orderModalData}
        />
      </Modal>
    )}
  </main>
);
