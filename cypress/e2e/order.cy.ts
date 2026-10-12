import selectors from '../support/selectors';

const testUser = {
  id: 'test-user',
  email: 'test@example.com',
  name: 'Test User',
  password: 'password'
};

const addBurgerToCart = () => {
  cy.get(selectors.bunCard)
    .first()
    .within(() => {
      cy.contains(selectors.addButton).click();
    });

  cy.get(selectors.mainCard)
    .eq(0)
    .within(() => {
      cy.contains(selectors.addButton).click();
    });

  cy.get(selectors.sauceCard)
    .eq(0)
    .within(() => {
      cy.contains(selectors.addButton).click();
    });

  cy.get(selectors.addToCartButton).click();
};

describe('оформление заказа', () => {
  beforeEach(() => {
    // сервера нет: пользователь хранится в localStorage, сессия — в cookie
    cy.setCookie('accessToken', `mock.${testUser.id}`);

    cy.visit('/#/constructor', {
      onBeforeLoad(win) {
        win.localStorage.setItem('bb:users', JSON.stringify([testUser]));
      }
    });

    cy.contains(testUser.name).should('exist');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearAllCookies();
  });

  it('кладёт собранный бургер в корзину и очищает конструктор', () => {
    addBurgerToCart();

    cy.get(selectors.constructorItem).should('not.exist');
    cy.get(selectors.cartCount).should('have.text', '1');

    cy.get(selectors.goToCart).click();
    cy.get(selectors.cartItem).should('have.length', 1);
  });

  it('оформляет самовывоз и показывает номер и прогресс заказа', () => {
    addBurgerToCart();
    cy.get(selectors.cartLink).click();

    cy.get(selectors.cartEta).should('contain.text', 'Будет готов');
    cy.get(selectors.orderButton).click();

    // номер появляется, когда заказ оформлен
    cy.get(selectors.modal).contains(/^\d+$/).should('exist');
    cy.get(selectors.modal).find(selectors.orderProgress).should('exist');
    cy.get(selectors.modal).should('contain.text', 'Готов к выдаче');

    cy.get(selectors.modalOverlay).click({ force: true });

    cy.get(selectors.modal).should('not.exist');
    cy.get(selectors.cartItem).should('not.exist');
    cy.contains('В корзине пока пусто').should('exist');
  });

  it('меняет количество бургеров в корзине', () => {
    addBurgerToCart();
    cy.get(selectors.cartLink).click();

    cy.get('[aria-label="Увеличить количество"]').click();
    cy.get(selectors.cartItemCount).should('have.text', '2');
    cy.get(selectors.cartCount).should('have.text', '2');

    cy.get('[aria-label="Уменьшить количество"]').click().click();
    cy.get(selectors.cartItem).should('not.exist');
  });

  it('для доставки требует адрес и телефон', () => {
    addBurgerToCart();
    cy.get(selectors.cartLink).click();

    cy.contains('Доставка').click();
    cy.get(selectors.cartEta).should('contain.text', 'Привезём');

    cy.get(selectors.orderButton).click();
    cy.contains('Укажите адрес доставки').should('exist');

    cy.get('input[name="address"]').type('ул. Тестовая, 1');
    cy.get(selectors.orderButton).click();
    cy.contains('Укажите телефон').should('exist');

    cy.get('input[name="phone"]').type('+7 999 123-45-67');
    cy.get('input[name="comment"]').type('без лука');
    cy.get(selectors.orderButton).click();

    cy.get(selectors.modal).contains(/^\d+$/).should('exist');
    cy.get(selectors.modal).should('contain.text', 'В пути');
  });
});
