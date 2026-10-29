#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('\n======================================================');
console.log('   MASTER CRM — EXECUTIVE REAL-TIME BACKUP SYNC      ');
console.log('======================================================\n');

try {
  // Step 1: Check git status
  const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

  if (statusOutput) {
    console.log('📦 Staging local modifications...');
    execSync('git add -A', { stdio: 'inherit' });

    console.log(`📝 Creating backup commit [${timestamp}]...`);
    const commitMsg = `backup: ${timestamp} (Executive Real-Time Sync)`;
    execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
    console.log('✅ Local backup committed successfully.');
  } else {
    console.log('⚡ Working tree clean. No uncommitted local modifications.');
  }

  // Step 2: Check remote configuration
  let hasRemote = false;
  try {
    const remotes = execSync('git remote', { encoding: 'utf-8' }).trim();
    hasRemote = remotes.split('\n').map(r => r.trim()).includes('origin');
  } catch (err) {
    hasRemote = false;
  }

  if (hasRemote) {
    console.log('🚀 Pushing to GitHub remote (origin)...');
    try {
      execSync('git push origin HEAD', { stdio: 'inherit' });
      console.log('\n🌟 [SUCCESS] Real-time backup mirrored to GitHub and ready for Vercel deployment!\n');
    } catch (pushErr) {
      console.error('\n⚠️ Push to GitHub remote failed. Please ensure your GitHub repository URL and credentials are configured correctly.\n');
    }
  } else {
    console.log('\n💡 GitHub remote "origin" is not configured yet.');
    console.log('   To connect your GitHub repository, run:');
    console.log('   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git');
    console.log('   git push -u origin main\n');
  }

} catch (err) {
  console.error('\n❌ Backup encountered an error:', err.message);
  process.exit(1);
}
