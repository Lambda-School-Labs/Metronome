// / <reference types="Cypress" />
// / <reference types="Mocha" />

describe('Metronome front-end', () => {
  context('Visit the Metronome website', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });

    it('Should contain the brand title Metronome', () => {
      // http://localhost:3000/
      cy.visit('http://localhost:3000');
      cy.title().should('include', 'Metronome');
    });

    it('Should have signup and login links', () => {
      // Get DOM elements by class
      cy.get('.nav').should('contain', 'Sign Up');
      cy.get('.nav').should('contain', 'Log In');
    });

    it('Should have Buy Now button', () => {
      cy.get('.btn').should('contain', 'Buy Now');
    });

    it('Should have carousel', () => {
      cy.get('.carousel .slider').children().should('have.class', 'slide');
    });
  });

  context('Go to Signup page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
    it('Should redirect to signup page when clicking signup', () => {
      cy.contains('Sign Up').click();
      cy.url().should('include', '/signup');
      cy.get('input[name="firstName"]').type('John');
      cy.get('input[name="lastName"]').type('Smith');
      cy.get('input[name="username"]').type('123@123.com');
      cy.get('input[name="password"]').type('12345678');
      cy.get('input[name="confirmPassword"]').type('12345678');
    });
  });

  context('Go to Login page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
    it('Should redirect to login page when clicking login', () => {
      cy.contains('Log In').click();
      cy.url().should('include', '/login');
      cy.get('input[name="email"]').type('123@123.com');
      cy.get('input[name="password"]').type('12345678');
    });
  });
});
