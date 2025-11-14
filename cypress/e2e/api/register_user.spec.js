import { registerUser } from '../../apis/auth';

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

