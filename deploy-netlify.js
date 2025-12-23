#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Netlify Deployment Script');
console.log('============================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Run this script from the project root.');
  process.exit(1);
}

// Check environment variables
const requiredEnvVars = [
  'REACT_APP_API_URL',
  'REACT_APP_PRODUCTION_API_URL',
  'REACT_APP_FRONTEND_URL'
];

console.log('🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => {
  const value = process.env[varName];
  return !value || value.includes('your-') || value.includes('localhost');
});

if (missingVars.length > 0) {
  console.log('⚠️  Warning: Some environment variables may need updating for production:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}: ${process.env[varName] || 'not set'}`);
  });
  console.log('\n💡 Update your .env file or Netlify environment variables\n');
}

try {
  // Build the project
  console.log('📦 Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
  
  // Check if Netlify CLI is installed
  try {
    execSync('netlify --version', { stdio: 'ignore' });
    console.log('🌐 Netlify CLI detected');
    
    // Deploy to Netlify
    console.log('🚀 Deploying to Netlify...');
    execSync('netlify deploy --prod --dir=dist', { stdio: 'inherit' });
    
    console.log('\n🎉 Deployment completed!');
    console.log('🔗 Your site: https://capable-salamander-c75e58.netlify.app');
    
  } catch (error) {
    console.log('\n📝 Netlify CLI not found. Manual deployment options:');
    console.log('1. Install Netlify CLI: npm install -g netlify-cli');
    console.log('2. Or drag the "dist" folder to Netlify dashboard');
    console.log('3. Or connect your GitHub repo to Netlify for auto-deployment');
  }
  
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
}

console.log('\n📋 Post-deployment checklist:');
console.log('- ✅ Frontend deployed to Netlify');
console.log('- ⚠️  Backend needs to be deployed separately');
console.log('- ⚠️  Update API URLs in production environment');
console.log('- ⚠️  Configure CORS on backend for Netlify domain');
console.log('\n🔧 Next steps:');
console.log('1. Deploy your backend to Heroku/Railway/Vercel');
console.log('2. Update REACT_APP_PRODUCTION_API_URL with backend URL');
console.log('3. Test the full payment flow on production');