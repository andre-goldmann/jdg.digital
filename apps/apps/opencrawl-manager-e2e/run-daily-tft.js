#!/usr/bin/env node

/**
 * Run TFT Daily Scraper
 *
 * This script runs the TFT team composition scraper and optionally posts
 * the results to your configured channel.
 *
 * Usage:
 *   node run-daily-tft.js [--post] [--set=4.5] [--headless]
 *
 * Options:
 *   --post       Actually post to the channel (default: dry run)
 *   --set=X.X    Target specific TFT set (default: 4.5)
 *   --headless   Run in headless mode (default: true)
 *   --headed     Run in headed mode (see the browser)
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const shouldPost = args.includes('--post');
const headed = args.includes('--headed');
const setArg = args.find((arg) => arg.startsWith('--set='));
const targetSet = setArg ? setArg.split('=')[1] : '4.5';

console.log('🎮 TFT Daily Scraper');
console.log('═'.repeat(50));
console.log(`Target Set: ${targetSet}`);
console.log(`Post to Channel: ${shouldPost ? 'Yes' : 'No (dry run)'}`);
console.log(`Browser Mode: ${headed ? 'Headed' : 'Headless'}`);
console.log('═'.repeat(50));
console.log('');

// Load environment variables if .env exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✓ Loading environment variables from .env');
  // Simple .env parser (no dotenv dependency needed)
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
} else {
  console.log('ℹ No .env file found (you can copy .env.example to .env)');
}

// Build the Playwright command
const playwrightCmd = [
  'npx playwright test',
  'tft-daily-advanced.spec.ts',
  headed ? '--headed' : '',
  '--reporter=list,html',
]
  .filter(Boolean)
  .join(' ');

try {
  console.log('🚀 Running scraper...\n');

  // Set environment variables for the test
  const env = {
    ...process.env,
    TFT_TARGET_SET: targetSet,
    TFT_SHOULD_POST: shouldPost ? 'true' : 'false',
  };

  // Run the Playwright test
  execSync(playwrightCmd, {
    stdio: 'inherit',
    cwd: __dirname,
    env: env,
  });

  console.log('\n✅ Scraper completed successfully!');
  console.log('');

  // Show where the results are saved
  const date = new Date().toISOString().split('T')[0];
  const resultsDir = path.join(__dirname, 'test-results', 'daily-posts');
  const txtFile = path.join(resultsDir, `tft-daily-${date}.txt`);
  const jsonFile = path.join(resultsDir, `tft-daily-${date}.json`);

  if (fs.existsSync(txtFile)) {
    console.log('📄 Results saved to:');
    console.log(`   ${txtFile}`);
    console.log(`   ${jsonFile}`);
    console.log('');

    // Display the content
    const content = fs.readFileSync(txtFile, 'utf8');
    console.log('📋 Daily Post:');
    console.log('─'.repeat(50));
    console.log(content);
    console.log('─'.repeat(50));
  }

  if (shouldPost) {
    console.log('\n✉️ Post sent to daily_tft channel!');
  } else {
    console.log(
      '\nℹ️  Dry run complete. Use --post to actually send to channel.'
    );
  }
} catch (error) {
  console.error('\n❌ Error running scraper:');
  console.error(error.message);
  process.exit(1);
}
