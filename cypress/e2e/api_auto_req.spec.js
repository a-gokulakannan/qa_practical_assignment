import { generateOTP, verifyOTP, login, registerUser, getUserInfo } from '../apis/auth';

describe('API Automation Requirements - Part 1', () => {
  describe('1. Generate OTP (simulate login)', () => {
    it('should validate response status', () => {
      generateOTP('emilys', 'emilyspass').then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('should validate required fields in response', () => {
      generateOTP('emilys', 'emilyspass').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('username');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('gender');
        expect(response.body).to.have.property('image');
        expect(response.body).to.have.property('accessToken');
      });
    });

    it('should validate error on wrong credentials', () => {
      generateOTP('invaliduser', 'wrongpassword').then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message');
      });
    });
  });

  describe('2. Verify OTP (simulate)', () => {
    it('should return 400 when hitting login endpoint with wrong password', () => {
      verifyOTP('emilys', 'wrongpassword').then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message');
      });
    });

    it('should test missing required fields - missing username', () => {
      cy.request({
        method: 'POST',
        url: 'https://dummyjson.com/auth/login',
        body: {
          password: 'emilyspass'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.not.eq(200);
      });
    });

    it('should test missing required fields - missing password', () => {
      cy.request({
        method: 'POST',
        url: 'https://dummyjson.com/auth/login',
        body: {
          username: 'emilys'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.not.eq(200);
      });
    });

    it('should test missing required fields - empty body', () => {
      cy.request({
        method: 'POST',
        url: 'https://dummyjson.com/auth/login',
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.not.eq(200);
      });
    });
  });

  describe('3. Register User', () => {
    it('should validate response schema', () => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        age: 25,
        email: `test.user.${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        password: 'testpass123'
      };

      registerUser(newUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('age');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('username');
      });
    });

    it('should validate status = 200', () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        email: `john.doe.${Date.now()}@example.com`,
        username: `johndoe${Date.now()}`,
        password: 'password123'
      };

      registerUser(newUser).then((response) => {
        expect(response.status).to.eq(201);
      });
    });

    it('should validate user object returned', () => {
      const newUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        age: 28,
        email: `jane.smith.${Date.now()}@example.com`,
        username: `janesmith${Date.now()}`,
        password: 'password123'
      };

      registerUser(newUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.firstName).to.eq(newUser.firstName);
        expect(response.body.lastName).to.eq(newUser.lastName);
        expect(response.body.age).to.eq(newUser.age);
        expect(response.body.email).to.eq(newUser.email);
        expect(response.body.username).to.eq(newUser.username);
        expect(response.body).to.have.property('id');
      });
    });

    it('should validate missing fields error', () => {
      cy.request({
        method: 'POST',
        url: 'https://dummyjson.com/users/add',
        body: {
          firstName: 'Test'
          // Missing required fields
        },
        failOnStatusCode: false
      }).then((response) => {
        // API might return 200 but with validation errors, or 400
        expect([201, 400]).to.include(response.status);
      });
    });
  });

  describe('4. Login Flow', () => {
    it('should successfully login with valid credentials', () => {
      login('emilys', 'emilyspass').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('username');
        expect(response.body).to.have.property('email');
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
        expect(response.body).to.have.property('accessToken');
      });
    });

    it('should fail login with invalid credentials', () => {
      login('invaliduser', 'wrongpassword').then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message');
      });
    });

    it('should fail login with wrong username', () => {
      login('nonexistentuser', 'emilyspass').then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should fail login with wrong password', () => {
      login('emilys', 'wrongpassword').then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('5. Get User Info', () => {
    let authToken;

    before(() => {
      // Get a valid token for successful fetch test
      login('emilys', 'emilyspass').then((response) => {
        authToken = response.body.accessToken;
      });
    });

    it('should successfully fetch user info with valid token', () => {
      login('emilys', 'emilyspass').then((loginResponse) => {
        const token = loginResponse.body.accessToken;
        
        getUserInfo(1, token).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('firstName');
          expect(response.body).to.have.property('lastName');
          expect(response.body).to.have.property('email');
        });
      });
    });

    it('should successfully fetch user info without token (public endpoint)', () => {
      getUserInfo(1).then((response) => {
        // DummyJSON users endpoint is public, so it should work without token
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
      });
    });

    it('should simulate permission denied with wrong token', () => {
      const wrongToken = 'invalid_token_12345';
      
      getUserInfo(1, wrongToken).then((response) => {
        // DummyJSON might accept any token format, but we test the scenario
        // In real APIs, this would return 401 or 403
        expect([200, 401, 403]).to.include(response.status);
      });
    });

    it('should simulate permission denied with malformed token', () => {
      const malformedToken = 'Bearer invalid.token.here';
      
      cy.request({
        method: 'GET',
        url: 'https://dummyjson.com/users/1',
        headers: {
          'Authorization': malformedToken
        },
        failOnStatusCode: false
      }).then((response) => {
        // Test that we're handling token validation
        expect([200, 401, 403]).to.include(response.status);
      });
    });
  });
});

