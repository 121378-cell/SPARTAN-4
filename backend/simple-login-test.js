// Simple login test using fetch API
async function testLogin() {
  try {
    console.log('Testing login via HTTP request...');
    
    const credentials = {
      email: 'test2@example.com',
      password: 'password123'
    };
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login successful!', {
        user: data.user,
        hasTokens: !!data.tokens
      });
    } else {
      const errorData = await response.json();
      console.log('Login failed:', errorData);
    }
  } catch (error) {
    console.error('Error during login test:', error.message);
  }
}

testLogin();