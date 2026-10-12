import { FC } from 'react';
import styles from './order-progress.module.css';
import { OrderProgressUIProps } from './type';

export const OrderProgressUI: FC<OrderProgressUIProps> = ({
  steps,
  activeStep,
  progress,
  text
}) => (
  <div className={styles.wrap} data-testid='order-progress'>
    <ol className={styles.steps}>
      {steps.map((step, index) => (
        <li
          key={step}
          className={`text text_type_main-default ${styles.step} ${
            index <= activeStep ? styles.step_active : ''
          }`}
        >
          {step}
        </li>
      ))}
    </ol>
    <div className={styles.track}>
      <div
        className={styles.fill}
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
    <p className='text text_type_main-default mt-3'>{text}</p>
  </div>
);
