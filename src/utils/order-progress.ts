import { TDeliveryType, TOrder } from './types';

// Сервера и кухни нет, поэтому время готовности считается по формуле,
// а этап заказа — по тому, какая часть этого времени уже прошла.

// Во сколько раз демо быстрее жизни: при 15 «15 минут» проходят за минуту.
// Поставьте 1, чтобы заказ готовился в реальном времени.
export const TIME_SCALE = 3;

const BASE_MINUTES = 10;
const MINUTES_PER_EXTRA_BURGER = 3;
const DELIVERY_MINUTES = 25;

// заказы, созданные до появления времени готовности, считались готовыми через 20 секунд
const LEGACY_COOKING_MS = 20 * 1000;

const ACCEPTED_PART = 0.15;
const COOKED_PART = 0.6;

export const estimateMinutes = (
  burgersCount: number,
  deliveryType: TDeliveryType
): number =>
  BASE_MINUTES +
  MINUTES_PER_EXTRA_BURGER * Math.max(burgersCount - 1, 0) +
  (deliveryType === 'delivery' ? DELIVERY_MINUTES : 0);

export const getReadyAt = (createdAt: Date, minutes: number): Date =>
  new Date(createdAt.getTime() + (minutes * 60 * 1000) / TIME_SCALE);

export const getOrderProgress = (order: TOrder, now: number) => {
  const created = new Date(order.createdAt).getTime();
  const ready = order.readyAt
    ? new Date(order.readyAt).getTime()
    : created + LEGACY_COOKING_MS;
  const progress = Math.min(
    Math.max((now - created) / (ready - created), 0),
    1
  );
  const isDelivery = order.delivery?.type === 'delivery';

  let status = 'pending';
  if (progress >= 1) status = 'done';
  else if (progress < ACCEPTED_PART) status = 'created';
  else if (isDelivery && progress >= COOKED_PART) status = 'delivering';

  return {
    status,
    progress,
    minutesLeft: Math.ceil((1 - progress) * (order.minutes ?? 0))
  };
};
