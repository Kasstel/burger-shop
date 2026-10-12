import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrderRequest, TUser } from './types';
import { ingredients } from '../data/ingredients';
import {
  TStoredUser,
  addOrder,
  clearResetRequest,
  createResetCode,
  findOrder,
  getFeed,
  getResetRequest,
  getUserOrders,
  getUsers,
  saveUsers
} from './mock-db';

// Сервера нет: функции сохраняют прежние имена и форматы ответов,
// но данные берут из src/data/ingredients.ts и localStorage (см. mock-db.ts).

const RESPONSE_DELAY_MS = 400;
const TOKEN_PREFIX = 'mock.';

// отвечает с задержкой, как настоящий сервер; ошибка в handler отклоняет промис
const respond = <T>(handler: () => T): Promise<T> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(handler());
      } catch (err) {
        reject(err);
      }
    }, RESPONSE_DELAY_MS);
  });

type TServerResponse<T> = {
  success: boolean;
} & T;

const toUser = ({ email, name }: TStoredUser): TUser => ({ email, name });

const findCurrentUser = (): TStoredUser | undefined => {
  const token = getCookie('accessToken') ?? '';
  return token.startsWith(TOKEN_PREFIX)
    ? getUsers().find((item) => item.id === token.slice(TOKEN_PREFIX.length))
    : undefined;
};

const getCurrentUser = (): TStoredUser => {
  const user = findCurrentUser();
  if (!user) throw new Error('Вы не авторизованы');
  return user;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const getIngredientsApi = () =>
  respond<TIngredient[]>(() => ingredients);

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getFeedsApi = () =>
  respond<TFeedsResponse>(() => ({ success: true, ...getFeed() }));

export const getOrdersApi = () =>
  respond<TOrder[]>(() => getUserOrders(getCurrentUser().id));

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: TOrderRequest) =>
  respond<TNewOrderResponse>(() => {
    const user = getCurrentUser();
    if (!data.items.length) throw new Error('Корзина пуста');
    if (
      data.delivery.type === 'delivery' &&
      (!data.delivery.address || !data.delivery.phone)
    ) {
      throw new Error('Для доставки нужны адрес и телефон');
    }
    const order = addOrder(data, user.id);
    return { success: true, order, name: order.name };
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  respond<TOrderResponse>(() => {
    const order = findOrder(number, findCurrentUser()?.id);
    if (!order) throw new Error('Заказ не найден');
    return { success: true, orders: [order] };
  });

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

const toAuthResponse = (user: TStoredUser): TAuthResponse => ({
  success: true,
  accessToken: `${TOKEN_PREFIX}${user.id}`,
  refreshToken: `${TOKEN_PREFIX}refresh.${user.id}`,
  user: toUser(user)
});

export const registerUserApi = (data: TRegisterData) =>
  respond<TAuthResponse>(() => {
    const email = normalizeEmail(data.email);
    const name = data.name.trim();
    if (!email || !name || !data.password) {
      throw new Error('Заполните имя, e-mail и пароль');
    }
    const users = getUsers();
    if (users.some((item) => item.email === email)) {
      throw new Error('Пользователь с таким e-mail уже существует');
    }
    const user: TStoredUser = {
      id: `${Date.now()}`,
      email,
      name,
      password: data.password
    };
    saveUsers([...users, user]);
    return toAuthResponse(user);
  });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  respond<TAuthResponse>(() => {
    const email = normalizeEmail(data.email);
    const user = getUsers().find(
      (item) => item.email === email && item.password === data.password
    );
    if (!user) throw new Error('Неверный e-mail или пароль');
    return toAuthResponse(user);
  });

type TForgotPasswordResponse = TServerResponse<{ code: string }>;

// письма отправлять некому, поэтому код сброса возвращается в ответе
export const forgotPasswordApi = (data: { email: string }) =>
  respond<TForgotPasswordResponse>(() => {
    const email = normalizeEmail(data.email);
    if (!getUsers().some((item) => item.email === email)) {
      throw new Error('Пользователь с таким e-mail не найден');
    }
    return { success: true, code: createResetCode(email) };
  });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  respond<TServerResponse<{}>>(() => {
    const request = getResetRequest();
    if (!request || request.code !== data.token.trim()) {
      throw new Error('Неверный код');
    }
    if (!data.password) throw new Error('Введите новый пароль');
    saveUsers(
      getUsers().map((item) =>
        item.email === request.email
          ? { ...item, password: data.password }
          : item
      )
    );
    clearResetRequest();
    return { success: true };
  });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  respond<TUserResponse>(() => ({
    success: true,
    user: toUser(getCurrentUser())
  }));

export const updateUserApi = (user: Partial<TRegisterData>) =>
  respond<TUserResponse>(() => {
    const current = getCurrentUser();
    const users = getUsers();
    const email = user.email ? normalizeEmail(user.email) : current.email;
    if (users.some((item) => item.email === email && item.id !== current.id)) {
      throw new Error('Пользователь с таким e-mail уже существует');
    }
    const updated: TStoredUser = {
      ...current,
      email,
      name: user.name?.trim() || current.name,
      password: user.password || current.password
    };
    saveUsers(users.map((item) => (item.id === current.id ? updated : item)));
    return { success: true, user: toUser(updated) };
  });

export const logoutApi = () =>
  respond<TServerResponse<{}>>(() => ({ success: true }));

// сохраняет сессию так же, как это делалось с настоящим сервером
export const saveTokens = (data: {
  accessToken: string;
  refreshToken: string;
}) => {
  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
};
