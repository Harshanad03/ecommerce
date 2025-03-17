// This script compiles and runs the TypeScript seed-database.ts file
const { execSync } = require('child_process');
const path = require('path');

// First, compile the TypeScript file
console.log('Compiling TypeScript seed script...');
try {
  execSync('npx tsc --esModuleInterop src/scripts/seed-database.ts --outDir dist');
  console.log('Compilation successful!');
} catch (error) {
  console.error('Error compiling TypeScript:', error.message);
  process.exit(1);
}

// Then run the compiled JavaScript file
console.log('Running seed script...');
try {
  // We need to use node with the --require flag to load the module aliases
  execSync('node -r tsconfig-paths/register dist/src/scripts/seed-database.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error running seed script:', error.message);
  process.exit(1);
}
