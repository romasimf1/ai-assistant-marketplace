// Simple test script for authentication API
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api/v1';

async function testAuth() {
  try {
    console.log('Testing authentication API...');

    // Test registration
    console.log('\n1. Testing user registration...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test2@example.com',
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Register response:', registerData);

    if (registerData.success) {
      // Test login
      console.log('\n2. Testing user login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test2@example.com',
          password: 'testpassword123'
        })
      });

      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);

    if (loginData.success && loginData.data?.tokens) {
      // Test profile endpoint
      console.log('\n3. Testing profile endpoint...');
      const profileResponse = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${loginData.data.tokens.accessToken}`
        }
      });

      const profileData = await profileResponse.json();
      console.log('Profile response:', profileData);

      // Test refresh token
      console.log('\n4. Testing token refresh...');
      const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: loginData.data.tokens.refreshToken
        })
      });

      const refreshData = await refreshResponse.json();
      console.log('Refresh response:', refreshData);
    }
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testAuth();
}

module.exports = { testAuth };
