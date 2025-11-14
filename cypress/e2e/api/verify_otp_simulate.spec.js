import { verifyOTP } from '../../apis/auth';

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

