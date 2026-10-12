export type TIngredient = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[]; // все ингредиенты заказа одним списком
  // поля ниже есть только у заказов, оформленных через корзину
  items?: TOrderItem[];
  delivery?: TDelivery;
  comment?: string;
  minutes?: number; // обещанное время готовности
  readyAt?: string; // ISO
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export type TIngredientType = TTabMode | 'top' | 'bottom';

export type TBurger = {
  id: string;
  name: string;
  description: string;
  image: string;
  badge?: string;
  ingredients: string[];
};

export type TDeliveryType = 'pickup' | 'delivery';

export type TDelivery = {
  type: TDeliveryType;
  address?: string;
  phone?: string;
};

// бургер в заказе: ingredients — _id, булка первой и последней
export type TOrderItem = {
  name: string;
  ingredients: string[];
  count: number;
};

export type TOrderRequest = {
  items: TOrderItem[];
  delivery: TDelivery;
  comment?: string;
};

export type TCartItem = {
  id: string;
  name: string;
  bun: TIngredient;
  ingredients: TIngredient[];
  count: number;
};
