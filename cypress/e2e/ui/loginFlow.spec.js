import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';

describe('Section 1: Login Flow', () => {
  beforeEach(() => {
    // Visit login page before each test
    LoginPage.visit();
  });

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

