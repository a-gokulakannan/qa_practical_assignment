import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import UsersPage from '../../pages/UsersPage';

describe('UI Automation - Part 2: Login Automation', () => {
  beforeEach(() => {
    // Visit login page before each test
    LoginPage.visit();
  });

  describe('Section 1: Login Flow', () => {
    it('should successfully login with demo credentials and verify dashboard', () => {
      // Step 1: Visit login page
      // LoginPage.assertLoginPageVisible();

      // Step 2: Login using demo credentials
      const username = 'Admin';
      const password = 'admin123';
      LoginPage.login(username, password);

      // Step 3: Assert login was successful
      DashboardPage.assertLoginSuccessful();

      // Step 4: Assert dashboard is visible
      DashboardPage.assertDashboardVisible();
    });
  });

  describe('Section 2: Navigate to Users Section', () => {
    beforeEach(() => {
      // Login before each test in this section
      LoginPage.login('Admin', 'admin123');
      DashboardPage.assertLoginSuccessful();
    });

    it.only('should navigate to Users section and validate table', () => {
      // Step 1: Navigate from Dashboard → Admin → User Management → Users
      DashboardPage.navigateToUsers();

      // Step 2: Assert Users page is loaded
      UsersPage.assertUsersPageLoaded();

      // Step 3: Validate table requirements
      // - Table is visible
      // - Column headers are correct
      // - Rows load properly
      const expectedHeaders = ['Username', 'User Role', 'Employee Name', 'Status', 'Actions'];
      UsersPage.validateTableRequirements(expectedHeaders);
    });
  });
});

