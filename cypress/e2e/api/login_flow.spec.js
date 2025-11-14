import { login } from '../../apis/auth';

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

