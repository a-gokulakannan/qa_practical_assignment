
const BASE_URL = 'https://dummyjson.com';


export function generateOTP(username = 'emilys', password = 'emilyspass') {
  return cy.request({
    method: 'POST',
    url: `${BASE_URL}/auth/login`,
    body: {
      username: username,
      password: password
    },
    failOnStatusCode: false
  });
}

export function verifyOTP(username = 'emilys', password = 'emilyspass') {
  return cy.request({
    method: 'POST',
    url: `${BASE_URL}/auth/login`,
    body: {
      username: username,
      password: password
    },
    failOnStatusCode: false
  });
}

export function login(username = 'emilys', password = 'emilyspass') {
  return cy.request({
    method: 'POST',
    url: `${BASE_URL}/auth/login`,
    body: {
      username: username,
      password: password
    },
    failOnStatusCode: false
  });
}

export function registerUser(userData) {
  const defaultUserData = {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    username: 'johndoe',
    password: 'password123',
    birthDate: '1993-01-01',
    image: 'https://i.imgur.com/1.png',
    address: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      },
      country: 'USA'
    },
    company: {
      department: 'Engineering',
      name: 'Tech Corp',
      title: 'Software Engineer'
    }
  };

  const requestBody = { ...defaultUserData, ...userData };

  return cy.request({
    method: 'POST',
    url: `${BASE_URL}/users/add`,
    body: requestBody,
    failOnStatusCode: false
  });
}

export function getUserInfo(userId, token = null) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return cy.request({
    method: 'GET',
    url: `${BASE_URL}/users/${userId}`,
    headers: headers,
    failOnStatusCode: false
  });
}

