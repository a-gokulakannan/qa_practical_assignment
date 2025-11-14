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
    cypressActions.wait(5000);
    // Wait for User Management submenu to be visible
    cypressActions.waitForElement(this.userManagementMenuXpath);
    // Click on User Management
    cypressActions.clickElement(this.userManagementMenuXpath);
    // Wait a moment for submenu items to appear
    cypressActions.wait(5000);
    // Wait for Users option to be visible
    cypressActions.waitForElement(this.usersMenuXpath);
    // Click on Users
    cypressActions.clickElement(this.usersMenuXpath);
    // Wait for page to load
    cypressActions.wait(1000);
  }
}

export default new DashboardPage();

