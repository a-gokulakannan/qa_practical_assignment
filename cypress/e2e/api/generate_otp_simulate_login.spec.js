import { generateOTP } from '../../apis/auth';

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

