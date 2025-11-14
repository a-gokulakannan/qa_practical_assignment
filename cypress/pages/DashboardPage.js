import cypressActions from '../helper/cypressActions';

/**
 * Dashboard Page Object Model
 * Contains all selectors and methods for the OrangeHRM Dashboard page
 */
class DashboardPage {
  // XPath selector variables
  dashboardHeaderXpath = "//div[contains(@class, 'oxd-topbar-header-breadcrumb-module')]";
  dashboardTitleXpath = "//h6[text()='Dashboard']";
  userDropdownXpath = "//p[@class='oxd-userdropdown-name']";
  userDropdownMenuXpath = "//ul[contains(@class, 'oxd-userdropdown-tab')]";
  dashboardCardsXpath = "//div[contains(@class, 'oxd-sheet')]";
  quickLaunchSectionXpath = "//*[contains(text(), 'Quick Launch')]";
  employeeDistributionSectionXpath = "//*[contains(text(), 'Employee Distribution')]";
  mainMenuXpath = "//nav[contains(@class, 'oxd-main-menu')]";
  
  // Navigation menu XPath selectors
  adminMenuXpath = "//span[text()='Admin']";
  userManagementMenuXpath = "//span[text()='User Management ']";
  usersMenuXpath = "//a[text()='Users']";

  // Page elements/selectors
  get dashboardHeader() {
    return cypressActions.getElement(this.dashboardHeaderXpath);
  }

  get dashboardTitle() {
    return cypressActions.getElement(this.dashboardTitleXpath);
  }

  get userDropdown() {
    return cypressActions.getElement(this.userDropdownXpath);
  }

  get userDropdownMenu() {
    return cypressActions.getElement(this.userDropdownMenuXpath);
  }

  get dashboardCards() {
    return cypressActions.getElement(this.dashboardCardsXpath);
  }

  get quickLaunchSection() {
    return cypressActions.getElement(this.quickLaunchSectionXpath);
  }

  get employeeDistributionSection() {
    return cypressActions.getElement(this.employeeDistributionSectionXpath);
  }

  get mainMenu() {
    return cypressActions.getElement(this.mainMenuXpath);
  }

  // Page methods/actions
  assertDashboardVisible() {
    // Check for dashboard title
    cypressActions.assertElementVisible(this.dashboardTitleXpath);
    // Check for user dropdown (indicates successful login)
    cypressActions.assertElementVisible(this.userDropdownXpath);
  }

  assertLoginSuccessful() {
    // Verify dashboard title is visible
    cypressActions.assertElementVisible(this.dashboardTitleXpath);
    // Verify user dropdown is present (confirms authentication)
    cypressActions.assertElementVisible(this.userDropdownXpath);
  }

  getUsername() {
    return cypressActions.getElementText(this.userDropdownXpath);
  }

  // Navigation methods
  navigateToUsers() {
    // Click on Admin menu
    cypressActions.clickElement(this.adminMenuXpath);
    // Wait a moment for submenu to expand
    cypressActions.wait(1000);
    // Wait for User Management submenu to be visible
    cypressActions.waitForElement(this.userManagementMenuXpath);
    // Click on User Management
    cypressActions.clickElement(this.userManagementMenuXpath);
    // Wait a moment for submenu items to appear
    cypressActions.wait(1000);
    // Wait for Users option to be visible
    cypressActions.waitForElement(this.usersMenuXpath);
    // Click on Users
    cypressActions.clickElement(this.usersMenuXpath);
    // Wait for page to load
    cypressActions.wait(1000);
  }

  // Role-based access validation methods
  /**
   * Check if Admin menu is visible
   * @returns {Cypress.Chainable} - Chainable for assertions
   */
  checkAdminMenuVisible() {
    return cypressActions.getElement(this.adminMenuXpath).should('be.visible');
  }

  /**
   * Check if Admin menu is NOT visible
   * @returns {Cypress.Chainable} - Chainable for assertions
   */
  checkAdminMenuNotVisible() {
    return cypressActions.getElement(this.adminMenuXpath).should('not.exist');
  }

  /**
   * Check if User Management menu is visible
   * This requires Admin menu to be clicked first
   * @returns {Cypress.Chainable} - Chainable for assertions
   */
  checkUserManagementMenuVisible() {
    // First click Admin menu to expand it
    cypressActions.clickElement(this.adminMenuXpath);
    cypressActions.wait(1000);
    // Then check if User Management is visible
    return cypressActions.getElement(this.userManagementMenuXpath).should('be.visible');
  }

  /**
   * Check if User Management menu is NOT visible
   * This checks without clicking Admin menu first
   * @returns {Cypress.Chainable} - Chainable for assertions
   */
  checkUserManagementMenuNotVisible() {
    // Check if Admin menu exists first
    cypressActions.getElement(this.adminMenuXpath).then(($adminMenu) => {
      if ($adminMenu.length > 0) {
        // Admin menu exists, click it to check submenu
        cypressActions.clickElement(this.adminMenuXpath);
        cypressActions.wait(1000);
        // Check if User Management is not visible
        cypressActions.getElement(this.userManagementMenuXpath).should('not.exist');
      } else {
        // Admin menu doesn't exist, so User Management won't exist either
        cypressActions.getElement(this.userManagementMenuXpath).should('not.exist');
      }
    });
  }

  /**
   * Assert that Admin user can see User Management menu
   */
  assertAdminCanSeeUserManagement() {
    // Verify Admin menu is visible
    this.checkAdminMenuVisible();
    // Verify User Management is accessible
    this.checkUserManagementMenuVisible();
  }

  /**
   * Assert that non-admin user cannot see User Management menu
   * Non-admin users should not have access to the Admin button at all
   */
  assertNonAdminCannotSeeUserManagement() {
    // Non-admin users should not see the Admin menu at all
    cypressActions.getElement(this.adminMenuXpath).should('not.exist');
    // Also verify User Management doesn't exist (as a safety check)
    cypressActions.getElement(this.userManagementMenuXpath).should('not.exist');
  }
}

export default new DashboardPage();

