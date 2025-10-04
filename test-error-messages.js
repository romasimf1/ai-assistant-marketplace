// Simple test for error message handling
console.log('🧪 Testing Error Message Handling...\n');

// Test cases for different error scenarios
const testCases = [
  {
    input: 'Invalid email or password',
    expected: 'Invalid email or password',
    type: 'login'
  },
  {
    input: 'HTTP error! status: 401',
    expected: 'Invalid email or password',
    type: 'login'
  },
  {
    input: 'User with this email already exists',
    expected: 'User with this email already exists',
    type: 'register'
  },
  {
    input: 'Validation error',
    expected: 'Please check your input data',
    type: 'register'
  },
  {
    input: 'Network error',
    expected: 'Network error',
    type: 'other'
  }
];

// Simulate error handling logic
function getUserFriendlyErrorMessage(errorMessage, type) {
  if (type === 'login') {
    if (errorMessage.includes("Invalid email or password") ||
        errorMessage.includes("HTTP error! status: 401") ||
        errorMessage.includes("Authentication failed")) {
      return "Invalid email or password";
    }
  } else if (type === 'register') {
    if (errorMessage.includes("User with this email already exists") ||
        errorMessage.includes("already exists")) {
      return "User with this email already exists";
    } else if (errorMessage.includes("Validation error") ||
               errorMessage.includes("HTTP error! status: 400")) {
      return "Please check your input data";
    }
  }

  return errorMessage;
}

// Run tests
let passed = 0;
let total = testCases.length;

testCases.forEach((testCase, index) => {
  const result = getUserFriendlyErrorMessage(testCase.input, testCase.type);
  const success = result === testCase.expected;

  console.log(`Test ${index + 1}: ${success ? '✅' : '❌'}`);
  console.log(`  Input: "${testCase.input}"`);
  console.log(`  Expected: "${testCase.expected}"`);
  console.log(`  Got: "${result}"`);
  console.log(`  Type: ${testCase.type}`);
  console.log('');

  if (success) passed++;
});

console.log(`📊 Results: ${passed}/${total} tests passed`);

if (passed === total) {
  console.log('🎉 All error message tests passed!');
} else {
  console.log('⚠️  Some tests failed');
}

process.exit(passed === total ? 0 : 1);
