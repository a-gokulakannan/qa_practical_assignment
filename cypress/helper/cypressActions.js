/**
 * Cypress Actions Helper
 * Reusable Cypress action methods for single declaration and multiple use
 * This file contains all common Cypress actions that can be used across the test suite
 */

class CypressActions {

     // Utility to check if the selector is an XPath
  isXPath(element) {
    console.log("Selector received:", element);
    if (typeof element !== 'string') {
      console.log(`Incoming ${element}`)
      throw new TypeError(`Expected a string selector, but got ${typeof element}: ${element}`);
    }
    return element.startsWith("//") || element.startsWith("("); // basic XPath check
  }

  // Get element using CSS or XPath dynamically based on selector type
  getElement(element) {
    if (this.isXPath(element)) {
      return cy.xpath(element); // Use XPath if it's an XPath
    } else {
      return cy.get(element); // Otherwise, use CSS selector
    }
  }
  
  clickElement(element) {
    return this.getElement(element).click();
  }

  clickElementForce(element) {
    return this.getElement(element).click({ force: true });
  }

  typeText(element, text) {
    return this.getElement(element).type(text);
  }

  clearAndType(element, text) {
    return this.getElement(element).clear().type(text);
  }

  getElementByText(text) {
    return this.getElement(text).contains(text);
  }

  visitPage(url) {
    return cy.visit(url);
  }

  waitForElement(element) {
    return this.getElement(element).should('be.visible');
  }

  waitForElementToExist(element) {
    return this.getElement(element).should('exist');
  }

  assertElementVisible(element) {
    return this.getElement(element).should('be.visible');
  }

  assertElementNotVisible(element) {
    return this.getElement(element).should('not.be.visible');
  }

  assertElementContains(element, text) {
    return this.getElement(element).should('contain', text);
  }
 
  assertElementHasText(element, text) {
    return this.getElement(element).should('have.text', text);
  }

  assertUrlContains(urlPart) {
    return cy.url().should('include', urlPart);
  }

  assertUrlEquals(url) {
    return cy.url().should('eq', url);
  }

  assertElementHasAttribute(element, attribute, value) {
    return this.getElement(element).should('have.attr', attribute, value);
  }

  assertElementHasClass(element, className) {
    return this.getElement(element).should('have.class', className);
  }

  assertElementEnabled(element) {
    return this.getElement(element).should('be.enabled');
  }

  assertElementDisabled(element) {
    return this.getElement(element).should('be.disabled');
  }

  assertElementChecked(element) {
    return this.getElement(element).should('be.checked');
  }

  assertElementNotChecked(element) {
    return this.getElement(element).should('not.be.checked');
  }

  wait(milliseconds) {
    return cy.wait(milliseconds);
  }

  reloadPage() {
    return cy.reload();
  }

  goBack() {
    return cy.go('back');
  }

  goForward() {
    return cy.go('forward');
  }

  scrollIntoView(element, position = 'center') {
    return this.getElement(element).scrollIntoView({ position });
  }

  hoverElement(element) {
    return this.getElement(element).trigger('mouseover');
  }

  doubleClickElement(element) {
    return this.getElement(element).dblclick();
  }

  rightClickElement(element) {
    return this.getElement(element).rightclick();
  }

  selectOption(element, value) {
    return this.getElement(element).select(value);
  }

  checkElement(element) {
    return this.getElement(element).check();
  }

  uncheckElement(element) {
    return this.getElement(element).uncheck();
  }

  clearElement(element) {
    return this.getElement(element).clear();
  }

  getElementText(element) {
    return this.getElement(element).invoke('text');
  }

  getElementAttribute(element, attribute) {
    return this.getElement(element).invoke('attr', attribute);
  }
    
  takeScreenshot(name) {
    return cy.screenshot(name);
  }

  interceptRequest(method, url, response) {
    return cy.intercept(method, url, response);
  }

  makeRequest() {
    return cy.request();
  }
}

export default new CypressActions();

