import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi,
  getFeedsApi
} from '../utils/burger-api';
import { TOrder, TOrderRequest } from '../utils/types';
import { clearCart } from './cartSlice';
import type { AppDispatch } from '../services/store';

interface OrdersState {
  orders: TOrder[];
  selectedOrder: TOrder | null;
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchOrdersFeed = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('orders/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday
    };
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка получения ленты заказов');
  }
});

export const fetchOrdersAsync = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка загрузки заказов');
  }
});

export const orderBurgerAsync = createAsyncThunk<
  { order: TOrder; name: string },
  TOrderRequest,
  { rejectValue: string; dispatch: AppDispatch }
>('orders/create', async (request, { rejectWithValue, dispatch }) => {
  try {
    const response = await orderBurgerApi(request);

    dispatch(clearCart());

    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка создания заказа');
  }
});

export const getOrderByNumberAsync = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка поиска заказа');
  }
});

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    }
  },
  selectors: {
    orderRequestSelector(state) {
      return state.isLoading;
    },
    orderModalSelector(state) {
      return state.selectedOrder;
    },
    ordersSelector(state) {
      return state.orders;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchOrdersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.error = action.payload ?? 'Не удалось загрузить заказы';
        state.isLoading = false;
      })

      .addCase(orderBurgerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(orderBurgerAsync.fulfilled, (state, action) => {
        state.orders.unshift(action.payload.order);
        state.isLoading = false;
        state.selectedOrder = action.payload.order;
      })
      .addCase(orderBurgerAsync.rejected, (state, action) => {
        state.error = action.payload ?? 'Ошибка оформления заказа';
        state.isLoading = false;
      })

      .addCase(getOrderByNumberAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumberAsync.fulfilled, (state, action) => {
        state.selectedOrder = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrderByNumberAsync.rejected, (state, action) => {
        state.error = action.payload ?? 'Не удалось найти заказ';
        state.isLoading = false;
      })
      .addCase(fetchOrdersFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(fetchOrdersFeed.rejected, (state, action) => {
        state.error = action.payload || 'Ошибка';
        state.isLoading = false;
      });
  }
});

export const { orderRequestSelector, orderModalSelector, ordersSelector } =
  orderSlice.selectors;
export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
