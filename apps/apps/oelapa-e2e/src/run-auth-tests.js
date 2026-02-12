#!/usr/bin/env node

/**
 * E2E Test Runner for OELAPA Authentication Changes
 * 
 * This script validates the new authentication behavior where:
 * - Dashboard is accessible without login
 * - Protected routes (reservations) require authentication
 * - Guest users see appropriate UI indicators
 */

const { execSync } = require('child_process');

console.log('🧪 OELAPA E2E Test Suite - Authentication Changes Validation\n');

// Test configuration
const config = {
  baseURL: 'http://localhost:4200',
  timeout: 30000,
  retries: 1
};

console.log('📋 Test Configuration:');
console.log(`   Base URL: ${config.baseURL}`);
console.log(`   Timeout: ${config.timeout}ms`);
console.log(`   Retries: ${config.retries}\n`);

try {
  console.log('🔍 Running Dashboard Authentication Tests...');
  
  // Run the new dashboard authentication tests
  const dashboardTestCommand = `npx playwright test dashboard-authentication.spec.ts --reporter=line`;
  
  console.log(`   Command: ${dashboardTestCommand}`);
  
  execSync(dashboardTestCommand, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log('✅ Dashboard Authentication Tests completed\n');

  console.log('🔍 Running Reservation Tests...');
  
  // Run the updated reservation tests
  const reservationTestCommand = `npx playwright test reservation.spec.ts --reporter=line`;
  
  console.log(`   Command: ${reservationTestCommand}`);
  
  execSync(reservationTestCommand, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log('✅ Reservation Tests completed\n');

  console.log('🎉 All tests completed successfully!');
  console.log('\n📊 Summary of Changes Tested:');
  console.log('   ✅ Dashboard accessible without authentication');
  console.log('   ✅ Guest users see appropriate welcome message');
  console.log('   ✅ "Login required" indicators shown for protected features');
  console.log('   ✅ Login flow triggered when accessing protected routes');
  console.log('   ✅ Authenticated users see different UI content');
  console.log('   ✅ Reservation form accessible after authentication');
  console.log('   ✅ Direct navigation to protected routes requires login');

} catch (error) {
  console.error('❌ E2E Tests failed:');
  console.error(error.message);
  
  console.log('\n🔧 Troubleshooting Tips:');
  console.log('   1. Ensure the Angular app is running at http://localhost:4200');
  console.log('      Command: npx nx serve oelapa');
  console.log('   2. Ensure Keycloak is running at http://localhost:18080');
  console.log('      Command: docker-compose up -d');
  console.log('   3. Check if Playwright is installed:');
  console.log('      Command: npx playwright install');
  console.log('   4. Verify test user exists in Keycloak:');
  console.log('      Username: soulsaver, Password: Blade23');
  
  process.exit(1);
}