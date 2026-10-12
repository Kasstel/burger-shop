import { rootReducer } from '../services/store'; // путь к combineReducers
import burgerConstructorReducer from '../slices/burgerConstructorSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import ordersReducer from '../slices/orderSlice';
import userReducer from '../slices/authSlice';

describe('rootReducer', () => {
  it('инициализируется с ожидаемыми редьюсерами', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('cart');

    expect(state.burgerConstructor).toEqual(
      burgerConstructorReducer(undefined, { type: '@@INIT' })
    );
    expect(state.ingredients).toEqual(
      ingredientsReducer(undefined, { type: '@@INIT' })
    );
    expect(state.orders).toEqual(ordersReducer(undefined, { type: '@@INIT' }));
    expect(state.user).toEqual(userReducer(undefined, { type: '@@INIT' }));
  });
});
