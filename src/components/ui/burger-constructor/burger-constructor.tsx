import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  ConstructorElement
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement } from '@components';
import { Currency } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  price,
  isAddedToCart,
  onAddToCart
}) => (
  <section className={styles.burger_constructor}>
    {constructorItems.bun ? (
      <div
        className={`${styles.element} mb-4 mr-4`}
        data-testid='constructor-item'
      >
        <ConstructorElement
          type='top'
          isLocked
          text={`${constructorItems.bun.name} (верх)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        Выберите булки
      </div>
    )}
    <ul className={styles.elements}>
      {constructorItems.ingredients.length > 0 ? (
        constructorItems.ingredients.map(
          (item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={item.id}
            />
          )
        )
      ) : (
        <div
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите начинку
        </div>
      )}
    </ul>
    {constructorItems.bun ? (
      <div className={`${styles.element} mt-4 mr-4`}>
        <ConstructorElement
          type='bottom'
          isLocked
          text={`${constructorItems.bun.name} (низ)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        Выберите булки
      </div>
    )}
    <div className={`${styles.total} mt-10 mr-4`}>
      {isAddedToCart && (
        <Link
          to='/cart'
          className={`${styles.cartLink} text text_type_main-default mr-10`}
          data-testid='go-to-cart'
        >
          Бургер в корзине — оформить
        </Link>
      )}
      <div className={`${styles.cost} mr-10`}>
        <p className={`text ${styles.text} mr-2`}>{price}</p>
        <Currency size='large' />
      </div>
      <Button
        htmlType='button'
        type='primary'
        size='large'
        children='В корзину'
        onClick={onAddToCart}
        data-testid='add-to-cart-button'
      />
    </div>
  </section>
);
