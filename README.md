# QA Practical Assignment - Cypress Automation Project

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Installation Instructions](#installation-instructions)
4. [Running Tests](#running-tests)
5. [Test Cases Documentation](#test-cases-documentation)
6. [Screenshots and Videos](#screenshots-and-videos)
7. [Configuration](#configuration)
8. [Page Object Model](#page-object-model)
9. [API Testing](#api-testing)  
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This is a comprehensive Cypress automation project that covers both **UI Testing** and **API Testing** for:
- **OrangeHRM** (https://opensource-demo.orangehrmlive.com) - UI Testing
- **DummyJSON API** (https://dummyjson.com) - API Testing

The project follows **Page Object Model (POM)** pattern and includes:
- ✅ UI automation tests for login flows, navigation, and role-based access
- ✅ API automation tests for authentication, user registration, and data validation
- ✅ Integration tests combining API and UI validation
- ✅ Screenshots and video recordings (Cypress defaults)
- ✅ Reusable helper functions and custom commands

---

## 📁 Project Structure

```
qa_practical_assignment/
│
├── cypress/
│   ├── apis/                    # API helper functions
│   │   └── auth.js             # Authentication API methods
│   │
│   ├── e2e/                    # Test specifications
│   │   ├── api/                # API test suites
│   │   │   ├── all_in_one_api_req.spec.js
│   │   │   ├── generate_otp_simulate_login.spec.js
│   │   │   ├── login_flow.spec.js
│   │   │   ├── register_user.spec.js
│   │   │   └── verify_otp_simulate.spec.js
│   │   │
│   │   ├── ui/                 # UI test suites
│   │   │   ├── all_in_one_flow.spec.js
│   │   │   ├── loginFlow.spec.js
│   │   │   ├── navigateToUsersSection.spec.js
│   │   │   ├── roleBasedAccess.spec.js
│   │   │   └── validateApiToUiMapping.spec.js
│   │   │
│   │   └── dummyJSON_api.spec.js
│   │
│   ├── fixtures/               # Test data
│   │   ├── adminUser.json
│   │   └── nonAdminUser.json
│   │
│   ├── helper/                 # Helper utilities
│   │   └── cypressActions.js   # Reusable action methods
│   │
│   ├── pages/                  # Page Object Models
│   │   ├── DashboardPage.js
│   │   ├── LoginPage.js
│   │   └── UsersPage.js
│   │
│   ├── screenshots/            # Screenshots (generated on test failures)
│   │
│   ├── support/                # Support files
│   │   ├── commands.js         # Custom Cypress commands
│   │   └── e2e.js              # Global test configuration
│   │
│   └── videos/                 # Video recordings (generated on test runs)
│       └── *.mp4
│
├── cypress.config.js           # Cypress configuration
├── package.json                # Project dependencies
└── README.md                   # This file
```

---

## 🚀 Installation Instructions

### Prerequisites
- **Node.js** (v14 or higher recommended)
- **npm** (comes with Node.js) or **yarn**

### Step-by-Step Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd qa_practical_assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will install:
   - `cypress` (^12.0.0) - Testing framework
   - `cypress-xpath` (^2.0.1) - XPath selector support

3. **Verify installation**
   ```bash
   npx cypress verify
   ```

4. **Open Cypress Test Runner (Optional - for interactive testing)**
   ```bash
   npx run cypress open
   ```

---

## ▶️ Running Tests

### Option 1: Run All Tests (Headless Mode)

```bash
npx cypress run
```

This will:
- Run all test files in headless mode
- Generate screenshots for failed tests
- Generate video recordings for each test file
- Display results in the terminal

### Option 2: Run Tests with Cypress Test Runner (Interactive Mode)
```bash
npx cypress open
```

This will:
- Open Cypress Test Runner GUI
- Allow you to select and run specific test files
- Show real-time test execution
- Provide debugging capabilities

### Option 3: Run Specific Test File
```bash
npx cypress run --spec "cypress/e2e/ui/loginFlow.spec.js"
```

### Option 4: Run Tests in Specific Browser
```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

---

## 📝 Test Cases Documentation

### UI Test Cases

#### 1. **Login Flow** (`cypress/e2e/ui/loginFlow.spec.js`)
- **Test Case**: `should successfully login with demo credentials and verify dashboard`
  - Navigates to OrangeHRM login page
  - Logs in with Admin credentials (Admin/admin123)
  - Verifies successful login
  - Validates dashboard is visible

#### 2. **Navigate to Users Section** (`cypress/e2e/ui/navigateToUsersSection.spec.js`)
- **Test Case**: `should navigate to Users section and validate table`
  - Logs in as Admin user
  - Navigates: Dashboard → Admin → User Management → Users
  - Validates Users page is loaded
  - Verifies table structure and column headers:
    - Username
    - User Role
    - Employee Name
    - Status
    - Actions

#### 3. **Role-Based Access** (`cypress/e2e/ui/roleBasedAccess.spec.js`)
- **Test Case**: `should see User Management menu as Admin user`
  - Logs in as Admin user
  - Verifies Admin menu is visible
  - Verifies User Management menu is accessible
  
- **Test Case**: `should NOT see User Management menu as non-admin user`
  - Logs in as non-admin user (ESS role)
  - Verifies User Management menu is NOT accessible

- **Test Case**: `should validate Admin user access using fixture`
  - Uses fixture data for admin user credentials
  - Validates expected menu visibility based on role

- **Test Case**: `should validate non-admin user access using fixture`
  - Uses fixture data for non-admin user credentials
  - Validates restricted menu access

#### 4. **API to UI Mapping** (`cypress/e2e/ui/validateApiToUiMapping.spec.js`)
- **Test Case**: `should create user via DummyJSON API and validate in UI`
  - Creates a user using DummyJSON API
  - Attempts to search for the user in OrangeHRM UI
  - Validates search functionality (by name and email)
  - Note: This is a simulated test as DummyJSON and OrangeHRM are separate systems

#### 5. **All-in-One UI Flow** (`cypress/e2e/ui/all_in_one_flow.spec.js`)
- **Comprehensive test suite** covering:
  - Section 1: Login Flow
  - Section 2: Navigate to Users Section
  - Section 3: Validate API → UI Mapping (Simulated)
  - Section 4: Role-Based Access (Multiple scenarios)

### API Test Cases

#### 1. **Generate OTP (Simulate Login)** (`cypress/e2e/api/generate_otp_simulate_login.spec.js`)
- **Test Case**: `should validate response status`
  - Validates successful OTP generation returns status 200
  
- **Test Case**: `should validate required fields in response`
  - Validates response contains: id, username, email, firstName, lastName, gender, image, accessToken
  
- **Test Case**: `should validate error on wrong credentials`
  - Validates error response (400) for invalid credentials

#### 2. **Verify OTP (Simulate)** (`cypress/e2e/api/verify_otp_simulate.spec.js`)
- **Test Case**: `should return 400 when hitting login endpoint with wrong password`
  - Validates error handling for wrong password
  
- **Test Case**: `should test missing required fields - missing username`
  - Validates error handling when username is missing
  
- **Test Case**: `should test missing required fields - missing password`
  - Validates error handling when password is missing
  
- **Test Case**: `should test missing required fields - empty body`
  - Validates error handling for empty request body

#### 3. **Register User** (`cypress/e2e/api/register_user.spec.js`)
- **Test Case**: `should validate response schema`
  - Validates user registration returns correct schema
  
- **Test Case**: `should validate status = 201`
  - Validates successful registration returns status 201
  
- **Test Case**: `should validate user object returned`
  - Validates returned user object matches input data
  
- **Test Case**: `should validate missing fields error`
  - Validates error handling for missing required fields

#### 4. **Login Flow** (`cypress/e2e/api/login_flow.spec.js`)
- **Test Case**: `should successfully login with valid credentials`
  - Validates successful login with correct credentials
  - Validates response contains: id, username, email, firstName, lastName, accessToken
  
- **Test Case**: `should fail login with invalid credentials`
  - Validates error response (400) for invalid credentials
  
- **Test Case**: `should fail login with wrong username`
  - Validates error response for non-existent username
  
- **Test Case**: `should fail login with wrong password`
  - Validates error response for incorrect password

#### 5. **All-in-One API Requirements** (`cypress/e2e/api/all_in_one_api_req.spec.js`)
- **Comprehensive API test suite** covering:
  - Section 1: Generate OTP (simulate login)
  - Section 2: Verify OTP (simulate)
  - Section 3: Register User
  - Section 4: Login Flow
  - Section 5: Get User Info (with token validation)

#### 6. **DummyJSON API Tests** (`cypress/e2e/dummyJSON_api.spec.js`)
- **Authentication Flow**:
  - Generate OTP (simulated)
  - Verify OTP with valid/invalid credentials
  - Login with correct credentials
  
- **User Management**:
  - Register a new user
  - Get user info by ID

---

## 📸 Screenshots and Videos

### Screenshots
Cypress automatically captures screenshots when tests fail.

**Location**: `cypress/screenshots/`

**Structure**:
```
cypress/screenshots/
└── e2e/
    ├── ui/
    │   └── loginFlow.spec.js/
    │       └── (screenshot files)
    └── api/
        └── login_flow.spec.js/
            └── (screenshot files)
```

**Configuration**: Screenshots are enabled by default in Cypress. No additional configuration needed.

### Videos
Cypress automatically records videos for all test runs.

**Location**: `cypress/videos/`

**Structure**:
```
cypress/videos/
├── all_in_one_api_req.spec.js.mp4
├── login_flow.spec.js.mp4
├── loginFlow.spec.js.mp4
└── ... (one video per test file)
```

**Configuration**: Videos are enabled by default. To disable videos, add to `cypress.config.js`:
```javascript
module.exports = defineConfig({
  video: false,  // Disable video recording
  // ... other config
});
```

**Viewing Videos**:
- Videos are automatically generated after test runs
- Open the `.mp4` files in any video player
- Videos show the entire test execution with timestamps

**Note**: 
- Screenshots are only captured on test failures
- Videos are captured for all test runs (successful and failed)
- Both are stored in their respective directories automatically

---

## ⚙️ Configuration

### Cypress Configuration (`cypress.config.js`)

```javascript
{
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    specPattern: 'cypress/e2e/**/*.spec.js',
    supportFile: 'cypress/support/e2e.js'
  },
  env: {
    dummyBase: 'https://dummyjson.com'
  }
}
```

**Key Settings**:
- **baseUrl**: OrangeHRM demo application URL
- **specPattern**: Test file pattern
- **supportFile**: Global support file location
- **env.dummyBase**: DummyJSON API base URL

### Package.json Scripts

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run --record=false",
    "test": "npm run cypress:run"
  }
}
```

---

## 🏗️ Page Object Model

The project follows the **Page Object Model (POM)** pattern for better maintainability.

### Page Objects

#### 1. **LoginPage** (`cypress/pages/LoginPage.js`)
- Methods:
  - `visit()` - Navigate to login page
  - `enterUsername(username)` - Enter username
  - `enterPassword(password)` - Enter password
  - `clickLogin()` - Click login button
  - `login(username, password)` - Complete login flow
  - `assertLoginPageVisible()` - Verify login page elements

#### 2. **DashboardPage** (`cypress/pages/DashboardPage.js`)
- Methods:
  - `assertLoginSuccessful()` - Verify successful login
  - `assertDashboardVisible()` - Verify dashboard is visible
  - `navigateToUsers()` - Navigate to Users section
  - `checkAdminMenuVisible()` - Verify Admin menu visibility
  - `checkUserManagementMenuVisible()` - Verify User Management menu
  - `assertAdminCanSeeUserManagement()` - Verify admin access
  - `assertNonAdminCannotSeeUserManagement()` - Verify non-admin restrictions

#### 3. **UsersPage** (`cypress/pages/UsersPage.js`)
- Methods:
  - `assertUsersPageLoaded()` - Verify Users page is loaded
  - `validateTableRequirements(headers)` - Validate table structure
  - `searchByNameOrEmail(searchTerm)` - Search for users
  - `resetSearch()` - Reset search filters

### Helper Utilities

#### **cypressActions** (`cypress/helper/cypressActions.js`)
Reusable action methods:
- `visitPage(url)` - Navigate to URL
- `getElement(xpath)` - Get element by XPath
- `clearAndType(xpath, text)` - Clear and type text
- `clickElement(xpath)` - Click element
- `assertElementVisible(xpath)` - Assert element visibility
- `wait(ms)` - Wait for specified time

### Custom Commands

#### **loginOrange** (`cypress/support/commands.js`)
Custom Cypress command for quick login:
```javascript
cy.loginOrange('Admin', 'admin123');
```

---

## 🔌 API Testing

### API Helper Functions (`cypress/apis/auth.js`)

#### Available Functions:

1. **`generateOTP(username, password)`**
   - Simulates OTP generation via login endpoint
   - Returns Cypress request object

2. **`verifyOTP(username, password)`**
   - Simulates OTP verification
   - Returns Cypress request object

3. **`login(username, password)`**
   - Authenticates user
   - Returns response with accessToken

4. **`registerUser(userData)`**
   - Registers a new user
   - Accepts user data object
   - Returns created user object

5. **`getUserInfo(userId, token)`**
   - Fetches user information
   - Supports optional authentication token
   - Returns user data

### API Base URLs

- **DummyJSON API**: `https://dummyjson.com`
- **OrangeHRM API**: (Not used in this project, UI testing only)

### Test Data Fixtures

#### **adminUser.json**
```json
{
  "username": "Admin",
  "password": "admin123",
  "role": "Admin",
  "expectedMenus": {
    "admin": true,
    "userManagement": true
  }
}
```

#### **nonAdminUser.json**
```json
{
  "username": "gokul",
  "password": "Test@123",
  "role": "ESS",
  "expectedMenus": {
    "admin": false,
    "userManagement": false
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Tests fail with "Element not found"**
- **Solution**: Check if the application URL is accessible
- Verify selectors haven't changed in the application
- Use Cypress Test Runner to debug element selection

#### 2. **Videos/Screenshots not generated**
- **Solution**: Check disk space
- Verify write permissions for `cypress/screenshots/` and `cypress/videos/` directories
- Ensure video recording is enabled in config

#### 3. **API tests fail with timeout**
- **Solution**: Check internet connection
- Verify API endpoints are accessible
- Increase timeout in test configuration if needed

#### 4. **"Cypress is not installed" error**
- **Solution**: Run `npm install` again
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

#### 5. **XPath selectors not working**
- **Solution**: Verify `cypress-xpath` is installed
- Check that `cypress/support/e2e.js` imports xpath: `import 'cypress-xpath'`

### Debugging Tips

1. **Use Cypress Test Runner** for interactive debugging:
   ```bash
   npm run cypress:open
   ```

2. **Add console logs** in tests:
   ```javascript
   cy.log('Debug message');
   ```

3. **Use `.pause()`** to pause test execution:
   ```javascript
   cy.pause();
   ```

4. **Check Cypress Dashboard** for detailed test results (if configured)

---

## 📊 Test Execution Summary

### Total Test Files: **10**
- UI Tests: **5 files**
- API Tests: **5 files**

### Test Coverage:
- ✅ Login flows (UI & API)
- ✅ User registration (API)
- ✅ Navigation and page validation (UI)
- ✅ Role-based access control (UI)
- ✅ API response validation
- ✅ Error handling scenarios
- ✅ Integration testing (API → UI)

---

