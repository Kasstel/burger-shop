import { SyntheticEvent } from 'react';
import { TDeliveryType, TOrder } from '@utils-types';

export type TCartLine = {
  id: string;
  name: string;
  image: string;
  composition: string;
  count: number;
  price: number;
};

export type CartUIProps = {
  items: TCartLine[];
  total: number;
  minutes: number;
  deliveryType: TDeliveryType;
  address: string;
  phone: string;
  comment: string;
  errorText: string;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  onCountChange: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onDeliveryTypeChange: (type: TDeliveryType) => void;
  setAddress: (value: string) => void;
  setPhone: (value: string) => void;
  setComment: (value: string) => void;
  handleSubmit: (e: SyntheticEvent) => void;
  closeOrderModal: () => void;
};
