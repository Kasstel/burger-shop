export type TMenuBurger = {
  id: string;
  name: string;
  description: string;
  image: string;
  badge?: string;
  price: number;
};

export type MenuUIProps = {
  burgers: TMenuBurger[];
  // бургер, который только что положили в корзину
  addedId: string | null;
  onAddToCart: (id: string) => void;
  onCustomize: (id: string) => void;
};
