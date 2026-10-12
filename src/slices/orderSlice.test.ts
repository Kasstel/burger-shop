import { TOrder } from '@utils-types';
import reducer, {
  fetchOrdersAsync,
  orderBurgerAsync,
  getOrderByNumberAsync,
  fetchOrdersFeed
} from './orderSlice';

const orderMock: TOrder = {
  _id: '123',
  name: 'Тестовый заказ',
  createdAt: '11-01-22',
  updatedAt: '11-02-22',
  number: 802,
  status: 'in progress',
  ingredients: ['1', '2']
};

describe('orderSlice', () => {
  it('pending → isLoading = true', () => {
    const state = reducer(undefined, fetchOrdersAsync.pending('', undefined));
    expect(state.isLoading).toBe(true);
  });

  it('fulfilled → заказы загружаются', () => {
    const state = reducer(
      undefined,
      fetchOrdersAsync.fulfilled([orderMock], '', undefined)
    );
    expect(state.orders).toEqual([orderMock]);
    expect(state.isLoading).toBe(false);
  });

  it('rejected → сохраняется ошибка', () => {
    const state = reducer(
      undefined,
      fetchOrdersAsync.rejected(null, '', undefined, 'Ошибка')
    );
    expect(state.error).toBe('Ошибка');
    expect(state.isLoading).toBe(false);
  });

  it('orderBurgerAsync → заказ добавляется и выделяется', () => {
    const payload = { order: orderMock, name: 'Тест' };
    const state = reducer(
      undefined,
      orderBurgerAsync.fulfilled(payload, '', {
        items: [{ name: 'Тест', ingredients: ['1', '2', '1'], count: 1 }],
        delivery: { type: 'pickup' }
      })
    );
    expect(state.orders[0]).toEqual(orderMock);
    expect(state.selectedOrder).toEqual(orderMock);
    expect(state.isLoading).toBe(false);
  });

  it('getOrderByNumberAsync → выбранный заказ устанавливается', () => {
    const state = reducer(
      undefined,
      getOrderByNumberAsync.fulfilled(orderMock, '', 123)
    );
    expect(state.selectedOrder).toEqual(orderMock);
    expect(state.isLoading).toBe(false);
  });

  it('fetchOrdersFeed → загрузка ленты заказов', () => {
    const payload = { orders: [orderMock], total: 100, totalToday: 10 };
    const state = reducer(
      undefined,
      fetchOrdersFeed.fulfilled(payload, '', undefined)
    );
    expect(state.orders).toEqual([orderMock]);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.isLoading).toBe(false);
  });
});
