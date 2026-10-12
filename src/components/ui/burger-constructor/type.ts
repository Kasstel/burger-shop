export type BurgerConstructorUIProps = {
  constructorItems: any;
  price: number;
  // бургер только что положили в корзину — показываем ссылку на оформление
  isAddedToCart: boolean;
  onAddToCart: () => void;
};
