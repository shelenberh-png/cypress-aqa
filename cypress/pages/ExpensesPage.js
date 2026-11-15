class ExpensesPage {
  // --- Елементи сторінки Expenses ---
  get addExpenseButton() {
    return cy.contains('button', 'Add an expense');
  }

  get expensesTableRows() {
    return cy.get('table.expenses_table tbody tr');
  }

  // Кнопка дропдауна з поточним авто над таблицею
  get selectedCar() {
    return cy.get('#carSelectDropdown');
  }

  // --- Елементи модального вікна "Add an expense" ---
  get modal() {
    return cy.get('.modal-content');
  }

  get vehicleDropdown() {
    return cy.get('#addExpenseCar');
  }

  get reportDateInput() {
    return cy.get('#addExpenseDate');
  }

  get mileageInput() {
    return cy.get('#addExpenseMileage');
  }

  get numberLitersInput() {
    return cy.get('#addExpenseLiters');
  }

  get totalCostInput() {
    return cy.get('#addExpenseTotalCost');
  }

  get submitAddExpenseButton() {
    return cy.get('.modal-footer').contains('button', 'Add');
  }

  get cancelAddExpenseButton() {
    return cy.get('.modal-footer').contains('button', 'Cancel');
  }

  // --- Дії ---
  open() {
    cy.visit('/panel/expenses');
    cy.url().should('include', '/panel/expenses');
  }

  clickAddExpense() {
    this.addExpenseButton.click();
  }

  // Обирає авто в дропдауні над таблицею, якщо воно ще не обране
  selectCar(carName) {
    this.selectedCar.invoke('text').then((text) => {
      if (text.trim() !== carName) {
        this.selectedCar.click();
        cy.contains('.car-select-dropdown_item', carName).click();
      }
    });
    this.selectedCar.should('contain', carName);
  }

  addExpense({ carId, mileage, liters, totalCost }) {
    this.clickAddExpense();
    this.modal.should('be.visible');

    if (carId) {
      this.vehicleDropdown.find('option').then(($options) => {
        const matchingOptions = [...$options].filter((option) => option.value.endsWith(`: ${carId}`));
        expect(matchingOptions, `vehicle option for car ${carId}`).to.have.length(1);
        this.vehicleDropdown.select(matchingOptions[0].value);
      });
    }

    this.mileageInput.clear().type(mileage);
    this.numberLitersInput.clear().type(liters);
    this.totalCostInput.clear().type(totalCost);
    this.submitAddExpenseButton.should('not.be.disabled').click();

    // Модалка закрилась, витрата збережена
    this.modal.should('not.exist');
  }
}

export default new ExpensesPage();