import selectors from 'cypress/support/selectors';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.visit('/#/constructor');
  });

  it('добавляет ингредиент в конструктор', () => {
    cy.get(selectors.ingredientCard)
      .first()
      .find(selectors.ingredientName)
      .invoke('text')
      .as('name');

    cy.get(selectors.ingredientCard).first().contains(`${selectors.addButton}`).click();

    cy.get('@name').then((name) => {
      cy.get(selectors.constructorItem).should('contain.text', name);
    });
  });

  it('добавляет начинку в конструктор', () => {
    cy.get(`${selectors.ingredientCard}${selectors.mainCard}`)
      .first()
      .find(selectors.ingredientName)
      .invoke('text')
      .as('name');

    cy.get(`${selectors.ingredientCard}${selectors.mainCard}`).first().contains(`${selectors.addButton}`).click();

    cy.get('@name').then((name) => {
      cy.get(selectors.constructorItem).should('contain.text', name);
    });
  });

  it('добавляет соус в конструктор', () => {
    cy.get(`${selectors.ingredientCard}${selectors.sauceCard}`)
      .first()
      .find(selectors.ingredientName)
      .invoke('text')
      .as('name');

    cy.get(`${selectors.ingredientCard}${selectors.sauceCard}`).first().contains(`${selectors.addButton}`).click();

    cy.get('@name').then((name) => {
      cy.get(selectors.constructorItem).should('contain.text', name);
    });
  });
});
