#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Pre-deployment checklist...\n');

const checks = [];

// Check if .env file exists and has Firebase config
function checkEnvironmentVariables() {
  const envPath = '.env';
  if (!fs.existsSync(envPath)) {
    checks.push({ name: 'Environment Variables', status: '❌', message: '.env file not found' });
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];

  const missingVars = requiredVars.filter(varName => {
    const line = envContent.split('\n').find(line => line.startsWith(varName));
    return !line || line.includes('your-') || line.includes('REPLACE');
  });

  if (missingVars.length > 0) {
    checks.push({ 
      name: 'Environment Variables', 
      status: '❌', 
      message: `Missing or placeholder values: ${missingVars.join(', ')}` 
    });
  } else {
    checks.push({ name: 'Environment Variables', status: '✅', message: 'All Firebase env vars configured' });
  }
}

// Check if Firebase config files exist
function checkFirebaseConfig() {
  const requiredFiles = [
    'firebase.json',
    '.firebaserc',
    'firestore.rules',
    'firestore.indexes.json'
  ];

  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    checks.push({ 
      name: 'Firebase Config', 
      status: '❌', 
      message: `Missing files: ${missingFiles.join(', ')}` 
    });
  } else {
    checks.push({ name: 'Firebase Config', status: '✅', message: 'All config files present' });
  }
}

// Check if .firebaserc has actual project ID
function checkProjectId() {
  if (!fs.existsSync('.firebaserc')) {
    checks.push({ name: 'Project ID', status: '❌', message: '.firebaserc not found' });
    return;
  }

  const firebaserc = JSON.parse(fs.readFileSync('.firebaserc', 'utf8'));
  const projectId = firebaserc.projects?.default;
  
  if (!projectId || projectId === 'your-project-id') {
    checks.push({ 
      name: 'Project ID', 
      status: '❌', 
      message: 'Update .firebaserc with your actual Firebase project ID' 
    });
  } else {
    checks.push({ name: 'Project ID', status: '✅', message: `Project: ${projectId}` });
  }
}

// Check if build directory exists or can be created
function checkBuildSetup() {
  try {
    // Check if we can run the build command
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.scripts?.build) {
      checks.push({ name: 'Build Script', status: '✅', message: 'Build script available' });
    } else {
      checks.push({ name: 'Build Script', status: '❌', message: 'No build script in package.json' });
    }
  } catch (error) {
    checks.push({ name: 'Build Script', status: '❌', message: 'Error reading package.json' });
  }
}

// Check if Firebase CLI is available
function checkFirebaseCLI() {
  try {
    const { execSync } = await import('child_process');
    execSync('firebase --version', { stdio: 'ignore' });
    checks.push({ name: 'Firebase CLI', status: '✅', message: 'Firebase CLI installed' });
  } catch (error) {
    checks.push({ 
      name: 'Firebase CLI', 
      status: '❌', 
      message: 'Install with: npm install -g firebase-tools' 
    });
  }
}

// Run all checks
async function runChecks() {
  checkEnvironmentVariables();
  checkFirebaseConfig();
  checkProjectId();
  checkBuildSetup();
  await checkFirebaseCLI();

  // Display results
  console.log('📋 Deployment Readiness Check:\n');
  
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}: ${check.message}`);
  });

  const failedChecks = checks.filter(check => check.status === '❌');
  
  console.log('\n' + '='.repeat(50));
  
  if (failedChecks.length === 0) {
    console.log('🎉 All checks passed! Ready for deployment.');
    console.log('\nRun: npm run deploy');
  } else {
    console.log(`❌ ${failedChecks.length} check(s) failed. Please fix the issues above.`);
    console.log('\n📚 Need help? Check:');
    console.log('   - FIRESTORE_SETUP.md');
    console.log('   - FIREBASE_DEPLOYMENT.md');
    console.log('   - FIRESTORE_TROUBLESHOOTING.md');
    process.exit(1);
  }
}

runChecks().catch(console.error);