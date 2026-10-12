import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartUI } from '@ui-pages';
import { TDeliveryType } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  cartCountSelector,
  cartItemsSelector,
  changeCount,
  removeFromCart
} from '../../slices/cartSlice';
import {
  clearSelectedOrder,
  orderBurgerAsync,
  orderModalSelector,
  orderRequestSelector
} from '../../slices/orderSlice';
import { userSelector } from '../../slices/authSlice';
import {
  getBurgerComposition,
  getBurgerIngredientIds,
  getBurgerPrice
} from '../../utils/burger';
import { estimateMinutes } from '../../utils/order-progress';

const MIN_ADDRESS_LENGTH = 5;
const MIN_PHONE_DIGITS = 10;

export const Cart: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector(cartItemsSelector);
  const burgersCount = useSelector(cartCountSelector);
  const user = useSelector(userSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderModalSelector);

  const [deliveryType, setDeliveryType] = useState<TDeliveryType>('pickup');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [errorText, setErrorText] = useState('');

  // иначе оформленный заказ снова всплывёт окном при возвращении в корзину
  useEffect(
    () => () => {
      dispatch(clearSelectedOrder());
    },
    [dispatch]
  );

  const items = useMemo(
    () =>
      cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.bun.image_mobile,
        composition: getBurgerComposition(item),
        count: item.count,
        price: getBurgerPrice(item)
      })),
    [cartItems]
  );

  const total = items.reduce((sum, item) => sum + item.price * item.count, 0);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!cartItems.length || orderRequest) return;

    const isDelivery = deliveryType === 'delivery';
    if (isDelivery && address.trim().length < MIN_ADDRESS_LENGTH) {
      setErrorText('Укажите адрес доставки');
      return;
    }
    if (isDelivery && phone.replace(/\D/g, '').length < MIN_PHONE_DIGITS) {
      setErrorText('Укажите телефон, чтобы курьер мог с вами связаться');
      return;
    }

    setErrorText('');
    dispatch(
      orderBurgerAsync({
        items: cartItems.map((item) => ({
          name: item.name,
          ingredients: getBurgerIngredientIds(item),
          count: item.count
        })),
        delivery: isDelivery
          ? { type: 'delivery', address: address.trim(), phone: phone.trim() }
          : { type: 'pickup' },
        comment: comment.trim() || undefined
      })
    )
      .unwrap()
      .then(() => setComment(''))
      .catch((error) => setErrorText(error));
  };

  return (
    <CartUI
      items={items}
      total={total}
      minutes={estimateMinutes(burgersCount, deliveryType)}
      deliveryType={deliveryType}
      address={address}
      phone={phone}
      comment={comment}
      errorText={errorText}
      orderRequest={orderRequest}
      orderModalData={orderModalData}
      onCountChange={(id, delta) => dispatch(changeCount({ id, delta }))}
      onRemove={(id) => dispatch(removeFromCart(id))}
      onDeliveryTypeChange={(type) => {
        setDeliveryType(type);
        setErrorText('');
      }}
      setAddress={setAddress}
      setPhone={setPhone}
      setComment={setComment}
      handleSubmit={handleSubmit}
      closeOrderModal={() => dispatch(clearSelectedOrder())}
    />
  );
};
