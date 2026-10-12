import { burgers } from '../data/burgers';
import { TDelivery, TOrder, TOrderItem } from './types';
import {
  estimateMinutes,
  getOrderProgress,
  getReadyAt
} from './order-progress';

// Локальная замена серверу: пользователи и заказы хранятся в localStorage браузера.
// Пароли лежат в открытом виде — это демо без бэкенда.

export type TStoredUser = {
  id: string;
  email: string;
  name: string;
  password: string;
};

type TStoredOrder = TOrder & { userId: string | null };

type TNewOrder = {
  items: TOrderItem[];
  delivery: TDelivery;
  comment?: string;
};

const USERS_KEY = 'bb:users';
const ORDERS_KEY = 'bb:orders';
const ORDER_NUMBER_KEY = 'bb:order-number';
const RESET_KEY = 'bb:reset';

const FIRST_ORDER_NUMBER = 1000;
const SEED_ORDERS_COUNT = 15;
const FEED_LIMIT = 50;

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value));

export const getUsers = () => read<TStoredUser[]>(USERS_KEY, []);

export const saveUsers = (users: TStoredUser[]) => write(USERS_KEY, users);

const nextOrderNumber = (): number => {
  const number = read<number>(ORDER_NUMBER_KEY, FIRST_ORDER_NUMBER);
  write(ORDER_NUMBER_KEY, number + 1);
  return number;
};

const getBurgersCount = (items: TOrderItem[]) =>
  items.reduce((sum, item) => sum + item.count, 0);

const getOrderName = (items: TOrderItem[]): string => {
  const names = items.map((item) =>
    item.count > 1 ? `${item.name} × ${item.count}` : item.name
  );
  const shown = names.slice(0, 2).join(', ');
  return names.length > 2 ? `${shown} и ещё ${names.length - 2}` : shown;
};

const buildOrder = (
  { items, delivery, comment }: TNewOrder,
  userId: string | null,
  createdAt: Date
): TStoredOrder => {
  const number = nextOrderNumber();
  const minutes = estimateMinutes(getBurgersCount(items), delivery.type);
  return {
    _id: `order-${number}`,
    status: 'created',
    name: getOrderName(items),
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    number,
    // плоский список нужен для подсчёта суммы и фото в карточке заказа
    ingredients: items.flatMap((item) =>
      Array.from({ length: item.count }, () => item.ingredients).flat()
    ),
    items,
    delivery,
    comment,
    minutes,
    readyAt: getReadyAt(createdAt, minutes).toISOString(),
    userId
  };
};

const pickRandom = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

// булка в составе заказа идёт первой и последней: верх и низ
const withBottomBun = (ingredientIds: string[]) => [
  ...ingredientIds,
  ingredientIds[0]
];

// чтобы лента не была пустой при первом открытии сайта
const seedOrders = (): TStoredOrder[] => {
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;

  return Array.from({ length: SEED_ORDERS_COUNT }, (_, index) => {
    const picked = Array.from(
      new Set([pickRandom(burgers), pickRandom(burgers)])
    ).slice(0, 1 + (index % 2));
    const items = picked.map((burger) => ({
      name: burger.name,
      ingredients: withBottomBun(burger.ingredients),
      count: 1
    }));
    const age = hour + (twoDays * (SEED_ORDERS_COUNT - index)) / 16;
    return buildOrder(
      { items, delivery: { type: 'pickup' } },
      null,
      new Date(Date.now() - age)
    );
  });
};

const getStoredOrders = (): TStoredOrder[] => {
  const stored = read<TStoredOrder[] | null>(ORDERS_KEY, null);
  if (stored) return stored;
  const seeded = seedOrders();
  write(ORDERS_KEY, seeded);
  return seeded;
};

// статус не хранится, а вычисляется при чтении по прошедшему времени
const toOrder = ({ userId, ...order }: TStoredOrder): TOrder => ({
  ...order,
  status: getOrderProgress(order, Date.now()).status
});

const byDateDesc = (a: TOrder, b: TOrder) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

// адрес, телефон и комментарий видит только сам покупатель
const toPublicOrder = ({ delivery, comment, ...order }: TOrder): TOrder => ({
  ...order,
  delivery: delivery && { type: delivery.type }
});

export const getFeed = () => {
  const orders = getStoredOrders()
    .map(toOrder)
    .map(toPublicOrder)
    .sort(byDateDesc);
  const done = orders.filter((order) => order.status === 'done');
  const today = new Date().toDateString();
  return {
    orders: orders.slice(0, FEED_LIMIT),
    total: done.length,
    totalToday: done.filter(
      (order) => new Date(order.createdAt).toDateString() === today
    ).length
  };
};

export const getUserOrders = (userId: string): TOrder[] =>
  getStoredOrders()
    .filter((order) => order.userId === userId)
    .map(toOrder)
    .sort(byDateDesc);

export const findOrder = (
  number: number,
  userId?: string
): TOrder | undefined => {
  const stored = getStoredOrders().find((item) => item.number === number);
  if (!stored) return undefined;
  const order = toOrder(stored);
  return stored.userId && stored.userId === userId
    ? order
    : toPublicOrder(order);
};

export const addOrder = (order: TNewOrder, userId: string): TOrder => {
  const orders = getStoredOrders();
  const created = buildOrder(order, userId, new Date());
  write(ORDERS_KEY, [...orders, created]);
  return toOrder(created);
};

export const createResetCode = (email: string): string => {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  write(RESET_KEY, { email, code });
  return code;
};

export const getResetRequest = () =>
  read<{ email: string; code: string } | null>(RESET_KEY, null);

export const clearResetRequest = () => localStorage.removeItem(RESET_KEY);
