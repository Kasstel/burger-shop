import { FC } from 'react';
import styles from './currency.module.css';

type CurrencyProps = {
  size?: 'default' | 'large';
};

export const Currency: FC<CurrencyProps> = ({ size = 'default' }) => (
  <span
    className={`${styles.currency} ${size === 'large' ? styles.large : ''}`}
  >
    ₽
  </span>
);
