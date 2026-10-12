import { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@zlden/react-developer-burger-ui-components';

import styles from './menu.module.css';

import { MenuUIProps } from './type';
import { Currency } from '../../currency';

export const MenuUI: FC<MenuUIProps> = memo(
  ({ burgers, addedId, onAddToCart, onCustomize }) => (
    <main className={styles.containerMain}>
      <div className={styles.content}>
        <h1 className='text text_type_main-large mt-10 mb-2'>Наши бургеры</h1>
        <p className='text text_type_main-default text_color_inactive mb-6'>
          Выберите готовый — состав можно поменять — или соберите свой с нуля
        </p>
        <ul className={styles.list}>
          {burgers.map((burger) => (
            <li className={styles.card} key={burger.id} data-testid='menu-card'>
              {burger.badge && (
                <span className={`${styles.badge} text text_type_main-default`}>
                  {burger.badge}
                </span>
              )}
              <img
                className={styles.img}
                src={burger.image}
                alt={burger.name}
              />
              <div className={styles.body}>
                <h2 className='text text_type_main-medium'>{burger.name}</h2>
                <p
                  className={`${styles.description} text text_type_main-default text_color_inactive mt-2`}
                >
                  {burger.description}
                </p>
                <div className={styles.footer}>
                  <div className={styles.cost}>
                    <span className='text text_type_digits-default mr-2'>
                      {burger.price}
                    </span>
                    <Currency />
                  </div>
                  <Button
                    htmlType='button'
                    type='primary'
                    size='small'
                    extraClass={styles.button}
                    onClick={() => onAddToCart(burger.id)}
                  >
                    {addedId === burger.id ? 'Добавлено' : 'В корзину'}
                  </Button>
                </div>
                <button
                  className={`${styles.customize} text text_type_main-default mt-3`}
                  type='button'
                  onClick={() => onCustomize(burger.id)}
                >
                  Изменить состав
                </button>
              </div>
            </li>
          ))}
          <li className={styles.own}>
            <Link
              to='/constructor'
              className={`${styles.ownLink} text text_type_main-medium`}
            >
              <span className={styles.plus}>+</span>
              Собрать свой бургер
            </Link>
          </li>
        </ul>
      </div>
    </main>
  )
);
