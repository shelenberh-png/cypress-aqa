import garagePage from '../pages/GaragePage';
import expensesPage from '../pages/ExpensesPage';

describe('Garage and Fuel Expenses Flow (POM)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('button', 'Sign In').click();

    cy.get('#signinEmail').type(Cypress.expose('userEmail'));
    cy.env(['userPassword']).then(({ userPassword }) => {
      cy.get('#signinPassword').type(userPassword, { log: false });
    });

    cy.get('.modal-footer .btn-primary').click();
    cy.url().should('include', '/panel/garage');
  });

  it('should add a car and then add fuel expenses to it', () => {
    garagePage.addRandomCar('15000').then((car) => {
      const carName = car.name;
      expensesPage.open();

      expensesPage.addExpense({
        carId: car.id,
        mileage: '15500',
        liters: '45',
        totalCost: '1800',
      });

      // Показуємо таблицю саме для створеного авто
      expensesPage.selectCar(carName);

      expensesPage.expensesTableRows
        .first()
        .should('contain', '15500')
        .and('contain', '45L')
        .and('contain', '1800.00 USD');
    });
  });
});