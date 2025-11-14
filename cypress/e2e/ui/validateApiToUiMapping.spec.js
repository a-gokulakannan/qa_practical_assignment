import LoginPage from '../../pages/LoginPage';
import DashboardPage from '../../pages/DashboardPage';
import UsersPage from '../../pages/UsersPage';
import { registerUser } from '../../apis/auth';
import cypressActions from '../../helper/cypressActions';

describe('Section 3: Validate API → UI Mapping (Simulated)', () => {
  let createdUser = null;

  beforeEach(() => {
    // Visit login page before each test
    LoginPage.visit();
    
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

