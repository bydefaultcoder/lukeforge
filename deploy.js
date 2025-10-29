#!/usr/bin/env node

/**
 * Simple deployment script for Lukeforge website
 * Usage: node deploy.js [preview|production]
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);
const mode = args[0] || 'preview';

console.log('🚀 Lukeforge Deployment Script');
console.log('==============================');

// Check if dist folder exists
if (!existsSync('dist')) {
  console.log('📦 Building project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Check if netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'pipe' });
} catch (error) {
  console.log('📥 Installing Netlify CLI...');
  try {
    execSync('npm install -g netlify-cli', { stdio: 'inherit' });
  } catch (installError) {
    console.error('❌ Failed to install Netlify CLI. Please install manually:');
    console.error('   npm install -g netlify-cli');
    process.exit(1);
  }
}

// Deploy based on mode
console.log(`🚀 Deploying to ${mode === 'production' ? 'PRODUCTION' : 'PREVIEW'}...`);

try {
  if (mode === 'production') {
    execSync('netlify deploy --prod --dir=dist', { stdio: 'inherit' });
    console.log('🎉 Successfully deployed to production!');
  } else {
    execSync('netlify deploy --dir=dist', { stdio: 'inherit' });
    console.log('🎉 Successfully deployed preview!');
  }
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('\n💡 Make sure you are logged in to Netlify:');
  console.log('   netlify login');
  process.exit(1);
}

console.log('\n📋 Next steps:');
console.log('1. Check your site in the browser');
console.log('2. Test all functionality');
console.log('3. Set up custom domain (optional)');
console.log('4. Configure analytics (optional)');
