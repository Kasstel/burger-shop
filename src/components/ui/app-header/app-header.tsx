import React, { FC } from 'react';
import styles from './app-header.module.css';
import logo from '../../../images/logo.png';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  MenuIcon,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, RootState } from '../../../services/store';
import { cartCountSelector } from '../../../slices/cartSlice';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const cartCount = useSelector(cartCountSelector);
  const profilePath = user ? '/profile' : '/login';
  const location = useLocation(); // получаем объект location
  const currentPath = location.pathname; // текущий путь
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={`${styles.link} ${
              currentPath === '/' ? styles.link_active : ''
            }`}
          >
            <MenuIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-8'>Меню</p>
          </Link>

          <Link
            to='/constructor'
            className={`${styles.link} ${
              currentPath === '/constructor' ||
              currentPath.startsWith('/ingredients')
                ? styles.link_active
                : ''
            }`}
          >
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-8'>Конструктор</p>
          </Link>

          <Link
            to='/feed'
            className={`${styles.link} ${
              currentPath.startsWith('/feed') ? styles.link_active : ''
            }`}
          >
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>

        <Link to='/' className={styles.logo}>
          <img src={logo} alt='' />
          <span className='text text_type_main-medium ml-3'>Cosmo Burgers</span>
        </Link>

        <div className={styles.link_position_last}>
          <Link
            to='/cart'
            className={`${styles.link} mr-8 ${
              currentPath === '/cart' ? styles.link_active : ''
            }`}
            data-testid='cart-link'
          >
            <p className='text text_type_main-default'>Корзина</p>
            {cartCount > 0 && (
              <span
                className={`${styles.cartCount} text text_type_main-default ml-2`}
                data-testid='cart-count'
              >
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to={profilePath}
            className={`${styles.link} ${
              currentPath.startsWith('/profile') ||
              currentPath === '/login' ||
              currentPath === '/register' ||
              currentPath === '/forgot-password' ||
              currentPath === '/reset-password'
                ? styles.link_active
                : ''
            }`}
          >
            <ProfileIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>
              {user?.name || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
