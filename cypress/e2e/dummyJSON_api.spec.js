import { generateOTP, verifyOTP, login, registerUser, getUserInfo } from '../apis/auth';

describe('API Tests - DummyJSON Mock API', () => {
  describe('Authentication Flow', () => {
    it('should generate OTP (simulated)', () => {
      generateOTP('emilys', 'emilyspass').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('accessToken');
        expect(response.body).to.have.property('id');
      });
    });

    it('should verify OTP with valid credentials', () => {
      verifyOTP('emilys', 'emilyspass').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('accessToken');
      });
    });

    it('should verify OTP with invalid credentials', () => {
      verifyOTP('invalid', 'wrongpassword').then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should login with correct credentials', () => {
      login('emilys', 'emilyspass').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('accessToken');
        expect(response.body).to.have.property('id');
      });
    });
  });

  describe('User Management', () => {
    it('should register a new user', () => {
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        age: 25,
        email: 'test.user@example.com',
        username: 'testuser',
        password: 'testpass123'
      };

      registerUser(newUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.firstName).to.eq(newUser.firstName);
      });
    });

    it('should get user info by ID', () => {
      getUserInfo(1).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('firstName');
        expect(response.body).to.have.property('lastName');
      });
    });
  });
});
