import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import UsersPage from '../../pages/UsersPage';

describe('Section 2: Navigate to Users Section', () => {
  beforeEach(() => {
    // Visit login page before each test
    LoginPage.visit();
    
    // Login before each test in this section
    LoginPage.login('Admin', 'admin123');
    DashboardPage.assertLoginSuccessful();
  });

  it('should navigate to Users section and validate table', () => {
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

