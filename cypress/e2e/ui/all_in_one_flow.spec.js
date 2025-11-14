import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import UsersPage from '../../pages/UsersPage';
import { registerUser } from '../../apis/auth';
import cypressActions from '../../helper/cypressActions';

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

  describe('Section 3: Validate API → UI Mapping (Simulated)', () => {
    let createdUser = null;

    beforeEach(() => {
      // Login before each test in this section
      LoginPage.login('Admin', 'admin123');
      DashboardPage.assertLoginSuccessful();
      
      // Navigate to Users page
      DashboardPage.navigateToUsers();
      UsersPage.assertUsersPageLoaded();
    });

    it('should create user via DummyJSON API and validate in UI', () => {
      // Step 1: Create a user using DummyJSON API
      const timestamp = Date.now();
      const userData = {
        firstName: `TestUser${timestamp}`,
        lastName: `LastName${timestamp}`,
        email: `testuser${timestamp}@example.com`,
        username: `testuser${timestamp}`,
        age: 25
      };

      registerUser(userData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('email');
        
        createdUser = response.body;
        cy.log(`Created user via API: ${createdUser.firstName} ${createdUser.lastName} (${createdUser.email})`);

        // Step 2: Search for the user in UI (by name OR email)
        // Note: Since DummyJSON and OrangeHRM are separate systems, 
        // the user created via DummyJSON API won't actually appear in OrangeHRM UI.
        // This is a simulated test to demonstrate the API → UI mapping concept.
        // In a real scenario, you would create the user in OrangeHRM via API first.
        
        cy.log(`Attempting to search for user by name: "${createdUser.firstName}"`);
        
        // Try searching by name first
        cypressActions.wait(1500);
        UsersPage.searchByNameOrEmail(createdUser.firstName);
        
        // Check if user is found
        cypressActions.getElement(UsersPage.noRecordsFoundXpath).then(($noRecords) => {
          if ($noRecords.length > 0 && $noRecords.is(':visible')) {
            // Not found by name, try email
            cy.log(`User not found by name, trying email search...`);
            UsersPage.resetSearch();
            
            cy.log(`Attempting to search for user by email: "${createdUser.email}"`);
            UsersPage.searchByNameOrEmail(createdUser.email);
            cypressActions.wait(1500);
            
            // Check if found by email
            cypressActions.getElement(UsersPage.noRecordsFoundXpath).then(($noRecordsEmail) => {
              if ($noRecordsEmail.length > 0 && $noRecordsEmail.is(':visible')) {
                // User not found - log failure (expected since systems are separate)
                UsersPage.logSearchFailure(
                  createdUser.email, 
                  createdUser.firstName, 
                  createdUser.lastName, 
                  createdUser.email, 
                  'User not found in UI after searching by both name and email. This is expected since DummyJSON and OrangeHRM are separate systems.'
                );
                cy.log(`✗ User not found in UI. This is expected since DummyJSON and OrangeHRM are separate systems.`);
              } else {
                // Check if user data appears in results
                cypressActions.getElement(UsersPage.searchResultRowXpath).then(($rows) => {
                  let found = false;
                  const emailLower = createdUser.email.toLowerCase();
                  
                  $rows.each((_index, row) => {
                    const rowText = Cypress.$(row).text().toLowerCase();
                    if (rowText.includes(emailLower) || 
                        rowText.includes(createdUser.firstName.toLowerCase()) ||
                        rowText.includes(createdUser.lastName.toLowerCase())) {
                      found = true;
                      return false;
                    }
                  });
                  
                  if (found) {
                    cy.log(`✓ User found in UI using email: "${createdUser.email}"`);
                  } else {
                    UsersPage.logSearchFailure(
                      createdUser.email, 
                      createdUser.firstName, 
                      createdUser.lastName, 
                      createdUser.email, 
                      'User not found in search results'
                    );
                  }
                });
              }
            });
          } else {
            // Check if user data appears in results (searched by name)
            cypressActions.getElement(UsersPage.searchResultRowXpath).then(($rows) => {
              let found = false;
              const nameLower = createdUser.firstName.toLowerCase();
              
              $rows.each((index, row) => {
                const rowText = Cypress.$(row).text().toLowerCase();
                if (rowText.includes(nameLower) || 
                    rowText.includes(createdUser.lastName.toLowerCase()) ||
                    rowText.includes(createdUser.email.toLowerCase())) {
                  found = true;
                  return false;
                }
              });
              
              if (found) {
                cy.log(`✓ User found in UI using search term: "${createdUser.firstName}"`);
              } else {
                // Not found by name, try email
                cy.log(`User not found by name, trying email search...`);
                UsersPage.resetSearch();
                UsersPage.searchByNameOrEmail(createdUser.email);
                cypressActions.wait(1500);
                
                cypressActions.getElement(UsersPage.noRecordsFoundXpath).then(($noRecordsEmail) => {
                  if ($noRecordsEmail.length > 0 && $noRecordsEmail.is(':visible')) {
                    UsersPage.logSearchFailure(
                      createdUser.email, 
                      createdUser.firstName, 
                      createdUser.lastName, 
                      createdUser.email, 
                      'User not found in UI after searching by both name and email'
                    );
                  } else {
                    // Check email search results
                    cypressActions.getElement(UsersPage.searchResultRowXpath).then(($emailRows) => {
                      let emailFound = false;
                      $emailRows.each((index, row) => {
                        const rowText = Cypress.$(row).text().toLowerCase();
                        if (rowText.includes(createdUser.email.toLowerCase()) ||
                            rowText.includes(createdUser.firstName.toLowerCase()) ||
                            rowText.includes(createdUser.lastName.toLowerCase())) {
                          emailFound = true;
                          return false;
                        }
                      });
                      
                      if (emailFound) {
                        cy.log(`✓ User found in UI using email: "${createdUser.email}"`);
                      } else {
                        UsersPage.logSearchFailure(
                          createdUser.email, 
                          createdUser.firstName, 
                          createdUser.lastName, 
                          createdUser.email, 
                          'User not found in search results after searching by email'
                        );
                      }
                    });
                  }
                });
              }
            });
          }
        });
      });
    });
  });

  describe('Section 4: Role-Based Access (Simulated Scenario)', () => {
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
});

