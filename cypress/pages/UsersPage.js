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

  // Search elements XPath selectors
  searchUsernameInputXpath = "//label[text()='Username']/parent::div/following-sibling::div//input";
  searchButtonXpath = "//button[@type='submit']";
  resetButtonXpath = "//button[text()=' Reset ']";
  searchResultsTableXpath = "//div[contains(@class, 'oxd-table-body')]";
  searchResultRowXpath = "//div[contains(@class, 'oxd-table-body')]//div[contains(@class, 'oxd-table-row')]";
  noRecordsFoundXpath = "//span[text()='No Records Found']";


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

  // Search methods
  /**
   * Search for a user by username
   * @param {string} username - The username to search for
   */
  searchByUsername(username) {
    cypressActions.clearAndType(this.searchUsernameInputXpath, username);
    cypressActions.clickElement(this.searchButtonXpath);
    // Wait for search results to load
    cypressActions.wait(1000);
  }

  /**
   * Search for a user by name or email
   * Note: OrangeHRM search typically uses username field, but we can search by partial match
   * @param {string} searchTerm - The name or email to search for
   */
  searchByNameOrEmail(searchTerm) {
    // In OrangeHRM, we'll use the username field for search
    // The search might match partial names or usernames
    cypressActions.clearAndType(this.searchUsernameInputXpath, searchTerm);
    cypressActions.clickElementForce(this.searchButtonXpath);
    // Wait for search results to load
    cypressActions.wait(1000);
  }

  /**
   * Reset the search filters
   */
  resetSearch() {
    cypressActions.scrollIntoView(this.resetButtonXpath);
    cypressActions.clickElement(this.resetButtonXpath);
    cypressActions.wait(500);
  }


  /**
   * Validate user appears in the user list
   * @param {string} searchTerm - The name or email to search for
   * @param {object} userData - User data object with firstName, lastName, email
   */
  assertUserAppearsInList(searchTerm, userData = {}) {
    // Perform search
    this.searchByNameOrEmail(searchTerm);

    // Wait for results
    cypressActions.wait(1500);

    // Check if "No Records Found" message exists
    cypressActions.getElement(this.noRecordsFoundXpath).then(($noRecords) => {
      if ($noRecords.length > 0 && $noRecords.is(':visible')) {
        // No records found - log failure
        this.logSearchFailure(searchTerm, userData.firstName, userData.lastName, userData.email, 'No records found');
        // Use Cypress assertion to fail the test
        cy.fail(`User not found: No records found for search term "${searchTerm}"`);
      }
    });

    // Check if records exist and validate user is in the list
    const searchLower = searchTerm.toLowerCase();
    const firstNameLower = userData.firstName ? userData.firstName.toLowerCase() : '';
    const lastNameLower = userData.lastName ? userData.lastName.toLowerCase() : '';
    const emailLower = userData.email ? userData.email.toLowerCase() : '';
    const fullName = `${firstNameLower} ${lastNameLower}`.trim();

    // Get all rows and check if user exists
    cypressActions.getElement(this.searchResultRowXpath).then(($rows) => {
      if ($rows.length === 0) {
        this.logSearchFailure(searchTerm, userData.firstName, userData.lastName, userData.email, 'No rows found in search results');
        cy.fail(`User not found: No rows found for search term "${searchTerm}"`);
      }

      let userFound = false;
      
      // Check each row
      $rows.each((index, row) => {
        const rowText = Cypress.$(row).text().toLowerCase();
        
        // Check if row contains search term or user data
        if (rowText.includes(searchLower) ||
            (firstNameLower && rowText.includes(firstNameLower)) ||
            (lastNameLower && rowText.includes(lastNameLower)) ||
            (fullName && rowText.includes(fullName)) ||
            (emailLower && rowText.includes(emailLower))) {
          userFound = true;
          return false; // Break the loop
        }
      });

      if (!userFound) {
        this.logSearchFailure(searchTerm, userData.firstName, userData.lastName, userData.email, 'User not found in search results');
        cy.fail(`User not found: Search term "${searchTerm}" did not match any user in the results`);
      }

      // User found - assertion passes
      expect(userFound, `User with search term "${searchTerm}" should appear in the list`).to.be.true;
    });
  }

  /**
   * Log search failure
   * @param {string} searchTerm - The search term used
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @param {string} email - User's email
   * @param {string} reason - Reason for failure
   */
  logSearchFailure(searchTerm, firstName, lastName, email, reason) {
    const logMessage = `
      ============================================
      SEARCH FAILURE LOG
      ============================================
      Search Term: ${searchTerm}
      User Details:
        - First Name: ${firstName || 'N/A'}
        - Last Name: ${lastName || 'N/A'}
        - Email: ${email || 'N/A'}
      Failure Reason: ${reason}
      Timestamp: ${new Date().toISOString()}
      ============================================
    `;
    
    cy.log(logMessage);
    console.error(logMessage);
  }
}

export default new UsersPage();

