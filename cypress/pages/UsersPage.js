import cypressActions from '../helper/cypressActions';

/**
 * Users Page Object Model
 * Contains all selectors and methods for the OrangeHRM Users page
 */
class UsersPage {
  // XPath selector variables
  usersPageTitleXpath = "//h5[text()='System Users']";
  usersTableXpath = "//div[@class='orangehrm-horizontal-padding orangehrm-vertical-padding']/span";
  tableBodyXpath = "//div[contains(@class, 'oxd-table-body')]";
  tableHeaderXpath = "//div[contains(@class, 'oxd-table-header')]";
  tableRowXpath = "//div[contains(@class, 'oxd-table-row')]";
  
  // Column header XPath selectors
  usernameHeaderXpath = "//div[text()='Username']";
  userRoleHeaderXpath = "//div[contains(@class, 'oxd-table-header')]//div[contains(text(), 'User Role')]";
  employeeNameHeaderXpath = "//div[contains(@class, 'oxd-table-header')]//div[contains(text(), 'Employee Name')]";
  statusHeaderXpath = "//div[contains(@class, 'oxd-table-header')]//div[contains(text(), 'Status')]";
  actionsHeaderXpath = "//div[contains(@class, 'oxd-table-header')]//div[contains(text(), 'Actions')]";


  // Page elements/selectors
  get usersPageTitle() {
    return cypressActions.getElement(this.usersPageTitleXpath);
  }

  get usersTable() {
    return cypressActions.getElement(this.usersTableXpath);
  }

  get tableBody() {
    return cypressActions.getElement(this.tableBodyXpath);
  }

  get tableHeader() {
    return cypressActions.getElement(this.tableHeaderXpath);
  }

  get tableRows() {
    return cypressActions.getElement(this.tableRowXpath);
  }

  // Page methods/actions
  assertUsersPageLoaded() {
    cypressActions.assertElementVisible(this.usersPageTitleXpath);
    cypressActions.assertUrlContains('/admin/viewSystemUsers');
  }

  assertTableVisible() {
    cypressActions.assertElementVisible(this.usersTableXpath);
    cypressActions.assertElementVisible(this.tableHeaderXpath);
    cypressActions.assertElementVisible(this.tableBodyXpath);
  }

  assertColumnHeadersCorrect(expectedHeaders) {
    // Check each expected column header is present
    expectedHeaders.forEach(headerText => {
      const headerXpath = `//div[text()='${headerText}']`;
      cypressActions.assertElementVisible(headerXpath);
    });
  }

  assertRowsLoadProperly() {
    // Wait for table body to be visible
    cypressActions.waitForElement(this.tableBodyXpath);
    
    // Wait a bit for data to load (if any)
    cypressActions.wait(1000);
    
    // Check that table body exists and is visible
    cypressActions.assertElementVisible(this.tableBodyXpath);
    
    // Verify that either rows exist or the table structure is present
    // This handles both cases: when there's data and when the table is empty
    cypressActions.getElement(this.tableBodyXpath).should('exist');
    
    // Check if rows exist (at least the structure should be there)
    // If no data, there might be an empty state, but the table structure should exist
    cypressActions.getElement(this.tableRowXpath).should('exist');
  }

  getRowCount() {
    return cypressActions.getElement(this.tableRowXpath).its('length');
  }

  validateTableRequirements(expectedHeaders) {
    this.assertTableVisible();
    this.assertColumnHeadersCorrect(expectedHeaders);
    this.assertRowsLoadProperly();
  }
}

export default new UsersPage();

