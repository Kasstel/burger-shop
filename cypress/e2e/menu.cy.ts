import selectors from '../support/selectors';

describe('Меню готовых бургеров', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('показывает готовые бургеры с ценой', () => {
    cy.get(selectors.menuCard).should('have.length.greaterThan', 0);
    cy.get(selectors.menuCard).first().contains(/^\d+$/).should('exist');
  });

  it('кладёт готовый бургер в корзину', () => {
    cy.get(selectors.menuCard).first().contains('В корзину').click();
    cy.get(selectors.cartCount).should('have.text', '1');

    // тот же бургер второй раз увеличивает количество, а не добавляет строку
    cy.get(selectors.menuCard).first().contains('button', /./).click();
    cy.get(selectors.cartCount).should('have.text', '2');

    cy.get(selectors.cartLink).click();
    cy.get(selectors.cartItem).should('have.length', 1);
    cy.get(selectors.cartItemCount).should('have.text', '2');
  });

  it('загружает выбранный бургер в конструктор для правки', () => {
    cy.get(selectors.menuCard).first().contains('Изменить состав').click();

    cy.location('hash').should('eq', '#/constructor');
    // булка сверху и хотя бы одна начинка
    cy.get(selectors.constructorItem).should('have.length.greaterThan', 1);
  });
});
