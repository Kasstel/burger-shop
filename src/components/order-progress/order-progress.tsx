import { FC, useEffect, useState } from 'react';
import { OrderProgressUI } from '@ui';
import { getOrderProgress } from '../../utils/order-progress';
import { OrderProgressProps } from './type';

const pickupSteps = ['Принят', 'Готовится', 'Готов к выдаче'];
const deliverySteps = ['Принят', 'Готовится', 'В пути', 'Доставлен'];
const stepByStatus: { [key: string]: number } = {
  created: 0,
  pending: 1,
  delivering: 2
};

export const OrderProgress: FC<OrderProgressProps> = ({ order }) => {
  const [now, setNow] = useState(() => Date.now());
  const { status, progress, minutesLeft } = getOrderProgress(order, now);
  const isDone = status === 'done';

  // пока заказ не готов, полоска и время обновляются раз в секунду
  useEffect(() => {
    if (isDone) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isDone]);

  const isDelivery = order.delivery?.type === 'delivery';
  const steps = isDelivery ? deliverySteps : pickupSteps;
  const activeStep = isDone ? steps.length - 1 : stepByStatus[status];

  let text = isDelivery
    ? `Привезём примерно через ${minutesLeft} мин`
    : `Будет готов примерно через ${minutesLeft} мин`;
  if (isDone) {
    text = isDelivery
      ? 'Заказ доставлен. Приятного аппетита!'
      : 'Заказ готов — ждём вас на выдаче';
  }

  return (
    <OrderProgressUI
      steps={steps}
      activeStep={activeStep}
      progress={progress}
      text={text}
    />
  );
};
