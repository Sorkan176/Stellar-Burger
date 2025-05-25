/// <reference types="cypress" />

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Перехват запроса на /api/ingredients и ответ моковыми данными
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Переход на главную страницу конструктора
    cy.visit('/');

    // Дожидаемся подгрузки ингредиентов
    cy.wait('@getIngredients');
  });

  it('должна отображать список ингредиентов', () => {
    // Проверим наличие заголовка и по одному из каждой категории ингредиентов
    cy.contains('Соберите бургер').should('exist');
    cy.get('[data-testid="ingredient-card-bun"]').should(
      'have.length.greaterThan',
      0
    );
    cy.get('[data-testid="ingredient-card-main"]').should(
      'have.length.greaterThan',
      0
    );
    cy.get('[data-testid="ingredient-card-sauce"]').should(
      'have.length.greaterThan',
      0
    );
  });
});

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запрос и отдаём фикстуру
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Открываем главную страницу
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен добавить булку, начинку и соус в конструктор', () => {
    // Добавляем булку
    cy.get('[data-testid="ingredient-card-bun"]')
      .first()
      .contains('Добавить')
      .click();

    // Проверяем, что булка отображается в конструкторе (верхняя и нижняя часть)
    cy.get('[data-testid="constructor-bun-top"]').should('exist');
    cy.get('[data-testid="constructor-bun-bottom"]').should('exist');

    // Добавляем начинку
    cy.get('[data-testid="ingredient-card-main"]')
      .first()
      .contains('Добавить')
      .click();

    // Проверяем, что начинка появилась в списке конструктора
    cy.get('[data-testid="constructor-ingredient"]').should('have.length', 1);

    // Добавляем соус
    cy.get('[data-testid="ingredient-card-sauce"]')
      .first()
      .contains('Добавить')
      .click();

    // Проверяем, что соус появился в списке конструктора
    cy.get('[data-testid="constructor-ingredient"]').should('have.length', 2);
  });
});

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должно открываться при клике на ингредиент', () => {
    cy.get('[data-testid="ingredient-card-main"]').first().click();

    // Проверяем, что модалка открылась
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="modal-title"]').should(
      'contain.text',
      'Детали ингредиента'
    );
    cy.get('[data-testid="modal-ingredient-title"]').should(
      'contain.text',
      'Мясо бессмертных'
    );
  });

  it('должно закрываться по крестику', () => {
    cy.get('[data-testid="ingredient-card-main"]').first().click();
    cy.get('[data-testid="modal"]').should('exist');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должно закрываться по клику на оверлей', () => {
    cy.get('[data-testid="ingredient-card-main"]').first().click();
    cy.get('[data-testid="modal"]').should('exist');

    cy.get('[data-testid="modal-overlay"]').click({ force: true }); // иногда нужно force
    cy.get('[data-testid="modal"]').should('not.exist');
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.setCookie('accessToken', 'mock-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  it('должен оформить заказ и очистить конструктор', () => {
    // Добавляем булку
    cy.get('[data-testid="ingredient-card-bun"]')
      .first()
      .contains('Добавить')
      .click();

    // Добавляем начинку
    cy.get('[data-testid="ingredient-card-main"]')
      .first()
      .contains('Добавить')
      .click();

    // Проверка, что булка и начинка появились
    cy.get('[data-testid="constructor-bun-top"]').should('exist');
    cy.get('[data-testid="constructor-ingredient"]').should('have.length', 1);

    // Нажимаем кнопку оформления
    cy.get('[data-testid="order-submit-button"]').click();

    // Проверяем, что отправлен запрос на заказ
    cy.wait('@createOrder');

    // Проверяем модалку с номером заказа
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="order-number"]').should('contain.text', '999999');

    // Закрываем модалку
    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // Проверяем, что конструктор пуст
    cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
    cy.get('[data-testid="constructor-ingredient"]').should('not.exist');
  });
});
