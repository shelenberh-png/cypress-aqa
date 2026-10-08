const selectors = {
  name: '#signupName',
  lastName: '#signupLastName',
  email: '#signupEmail',
  password: '#signupPassword',
  repeatPassword: '#signupRepeatPassword',
};

const validUser = () => ({
  name: 'Alex',
  lastName: 'Tester',
  email: `aqa.registration.${Date.now()}@example.com`,
  password: 'Testpass1',
  repeatPassword: 'Testpass1',
});

function openRegistration() {
  cy.visit('/');
  cy.contains('button', 'Sign up').click();
  cy.get(selectors.name).should('be.visible');
}

function fillRegistration(user, overrides = {}) {
  const values = { ...user, ...overrides };
  const fillField = (selector, value) => {
    if (value) {
      cy.get(selector).clear().type(value);
    } else {
      cy.get(selector).type('x').clear();
    }
  };

  if (values.name !== undefined) fillField(selectors.name, values.name);
  if (values.lastName !== undefined) fillField(selectors.lastName, values.lastName);
  if (values.email !== undefined) fillField(selectors.email, values.email);
  if (values.password !== undefined) fillField(selectors.password, values.password);
  if (values.repeatPassword !== undefined) fillField(selectors.repeatPassword, values.repeatPassword);
}

function clearAfterTyping(selector) {
  cy.get(selector).type('x').clear();
}

function expectFieldError(selector, message) {
  cy.get(selector).focus().blur();
  cy.get(selector).should('have.css', 'border-color', 'rgb(220, 53, 69)');
  cy.contains(message).should('be.visible');
}

describe('Registration', () => {
  it('creates a new account with valid data and a unique email', () => {
    const user = validUser();
    openRegistration();
    fillRegistration(user);
    cy.contains('button', 'Register').should('be.enabled').click();

    cy.location('pathname').should('match', /\/garage$/);
    cy.contains('a', 'Garage').should('be.visible');

    cy.clearCookies();
    cy.clearLocalStorage();
    cy.login(user.email, user.password);
  });

  it('requires a name and marks the empty field invalid', () => {
    openRegistration();
    clearAfterTyping(selectors.name);
    expectFieldError(selectors.name, 'Name required');
    cy.contains('button', 'Register').should('be.disabled');
  });

  it('rejects non-letter characters in the name', () => {
    openRegistration();
    fillRegistration({ name: 'Alex1' });
    expectFieldError(selectors.name, 'Name is invalid');
  });

  it('requires the name to contain from 2 to 20 characters after trimming', () => {
    openRegistration();
    fillRegistration({ name: 'A' });
    expectFieldError(selectors.name, 'Name has to be from 2 to 20 characters long');
  });

  it('requires a last name', () => {
    openRegistration();
    fillRegistration({ name: 'Alex', lastName: '' });
    expectFieldError(selectors.lastName, 'Last name required');
    cy.contains('button', 'Register').should('be.disabled');
  });

  it('validates last name characters and length', () => {
    openRegistration();
    fillRegistration({ name: 'Alex', lastName: 'Tester1' });
    expectFieldError(selectors.lastName, 'Last name is invalid');

    cy.get(selectors.lastName).clear().type('A');
    expectFieldError(selectors.lastName, 'Last name has to be from 2 to 20 characters long');
  });

  it('requires a valid email address', () => {
    openRegistration();
    fillRegistration({ name: 'Alex', lastName: 'Tester', email: 'not-an-email' });
    expectFieldError(selectors.email, 'Email is incorrect');

    cy.get(selectors.email).clear();
    expectFieldError(selectors.email, 'Email required');
    cy.contains('button', 'Register').should('be.disabled');
  });

  it('requires a password with 8 to 15 characters, a digit, and upper and lower case letters', () => {
    openRegistration();
    fillRegistration({ name: 'Alex', lastName: 'Tester', email: validUser().email, password: 'weak' });
    expectFieldError(
      selectors.password,
      'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
    );

    cy.get(selectors.password).clear();
    expectFieldError(selectors.password, 'Password required');
    cy.contains('button', 'Register').should('be.disabled');
  });

  it('requires the repeated password to match', () => {
    openRegistration();
    const user = validUser();
    fillRegistration({ name: user.name, lastName: user.lastName, email: user.email, password: user.password, repeatPassword: 'Different1' });
    expectFieldError(selectors.repeatPassword, 'Passwords do not match');
  });

  it('requires the repeated password', () => {
    openRegistration();
    const user = validUser();
    fillRegistration({ name: user.name, lastName: user.lastName, email: user.email, password: user.password, repeatPassword: '' });
    expectFieldError(selectors.repeatPassword, 'Re-enter password required');
    cy.contains('button', 'Register').should('be.disabled');
  });
});

