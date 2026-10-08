// Публічні креденшали basic auth з завдання (guest / welcome2qauto)
const BASIC_AUTH = { user: 'guest', pass: 'welcome2qauto' };

// GET /api/cars: список машин поточного користувача
Cypress.Commands.add('getCarsApi', () => {
  return cy.request({
    method: 'GET',
    url: '/api/cars',
    auth: BASIC_AUTH,
    failOnStatusCode: false,
  });
});

// POST /api/expenses: створює витрату, повертає повний response
Cypress.Commands.add('createExpenseApi', ({ carId, reportedAt, mileage, liters, totalCost }) => {
  return cy.request({
    method: 'POST',
    url: '/api/expenses',
    auth: BASIC_AUTH,
    body: { carId, reportedAt, mileage, liters, totalCost },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  cy.contains('button', 'Sign In').click();
  cy.get('#signinEmail').should('be.visible').type(email);
  cy.get('#signinPassword').type(password, { sensitive: true });
  cy.contains('button', 'Login').click();
  cy.location('pathname').should('match', /\/garage$/);
});

Cypress.Commands.overwrite('type', (originalFn, element, text, options = {}) => {
  if (options.sensitive) {
    options.log = false;
    Cypress.log({
      $el: element,
      name: 'type',
      message: '*'.repeat(String(text).length),
    });
  }

  return originalFn(element, text, options);
});
