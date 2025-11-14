import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';

describe('Section 4: Role-Based Access (Simulated Scenario)', () => {
  beforeEach(() => {
    // Visit login page before each test
    LoginPage.visit();
  });

  describe('Admin User Access', () => {
    beforeEach(() => {
      // Login as Admin user
      LoginPage.login('Admin', 'admin123');
      DashboardPage.assertLoginSuccessful();
    });

    it('should see User Management menu as Admin user', () => {
      // Verify Admin menu is visible
      DashboardPage.checkAdminMenuVisible();
      
      // Verify User Management menu is accessible
      DashboardPage.checkUserManagementMenuVisible();
      
      // Alternative: Use the assertion method
      DashboardPage.assertAdminCanSeeUserManagement();
      
      cy.log('✓ Admin user can see User Management menu');
    });
  });

  describe('Non-Admin User Access', () => {
    beforeEach(() => {
      // Login as non-admin user (ESS user)
      // OrangeHRM demo typically has essuser01/essuser01 for ESS role
      LoginPage.login('gokul', 'Test@123');
      DashboardPage.assertLoginSuccessful();
    });

    it('should NOT see User Management menu as non-admin user', () => {
      // Verify User Management menu is NOT accessible
      DashboardPage.assertNonAdminCannotSeeUserManagement();
      
      cy.log('✓ Non-admin user cannot see User Management menu');
    });
  });

  describe('Role-Based Access with Fixtures', () => {
    it('should validate Admin user access using fixture', () => {
      // Load admin user fixture
      cy.fixture('adminUser').then((adminUser) => {
        // Login as admin user from fixture
        LoginPage.login(adminUser.username, adminUser.password);
        DashboardPage.assertLoginSuccessful();
        
        // Verify expected menus based on fixture
        if (adminUser.expectedMenus.admin) {
          DashboardPage.checkAdminMenuVisible();
        }
        
        if (adminUser.expectedMenus.userManagement) {
          DashboardPage.checkUserManagementMenuVisible();
        }
        
        cy.log(`✓ ${adminUser.role} user access validated: ${adminUser.description}`);
      });
    });

    it('should validate non-admin user access using fixture', () => {
      // Load non-admin user fixture
      cy.fixture('nonAdminUser').then((nonAdminUser) => {
        // Login as non-admin user from fixture
        LoginPage.login(nonAdminUser.username, nonAdminUser.password);
        DashboardPage.assertLoginSuccessful();
        
        // Verify expected menus based on fixture
        if (!nonAdminUser.expectedMenus.admin) {
          // Admin menu should not be visible or User Management should not be accessible
          DashboardPage.assertNonAdminCannotSeeUserManagement();
        }
        
        cy.log(`✓ ${nonAdminUser.role} user access validated: ${nonAdminUser.description}`);
      });
    });
  });

  describe('Role-Based Access with DummyJSON User (Simulated)', () => {
    it('should simulate non-admin user scenario using DummyJSON user', () => {
      // Step 1: Create a non-admin user via DummyJSON API
      const timestamp = Date.now();
      const userData = {
        firstName: `NonAdmin${timestamp}`,
        lastName: `User${timestamp}`,
        email: `nonadmin${timestamp}@example.com`,
        username: `nonadmin${timestamp}`,
        age: 25
      };

      // Create user via API (simulated non-admin user)
      cy.request({
        method: 'POST',
        url: 'https://dummyjson.com/users/add',
        body: userData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(201);
        cy.log(`Created simulated non-admin user: ${userData.username}`);
        
        // Step 2: Login to OrangeHRM as actual non-admin user (essuser01)
        LoginPage.login('gokul', 'Test@123');
        DashboardPage.assertLoginSuccessful();
        
        // Step 3: Verify non-admin cannot see User Management menu
        DashboardPage.assertNonAdminCannotSeeUserManagement();
        
      });
    });
  });
});

