const fs = require('fs');
const path = require('path');

// Function to recursively find all dynamic route folders
function findDynamicRouteFolders(dir, results = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // Check if this is a dynamic route folder (starts with '[' and ends with ']')
      if (item.name.startsWith('[') && item.name.endsWith(']')) {
        results.push(fullPath);
      }
      
      // Recursively search subdirectories
      findDynamicRouteFolders(fullPath, results);
    }
  }
  
  return results;
}

// Find all dynamic route folders
const appDir = path.join(__dirname, 'src', 'app');
const dynamicRouteFolders = findDynamicRouteFolders(appDir);

console.log('Found dynamic route folders:');
dynamicRouteFolders.forEach(folder => console.log(folder));

// Group folders by their parent path to find conflicts
const foldersByParent = {};
dynamicRouteFolders.forEach(folder => {
  const parentPath = path.dirname(folder);
  if (!foldersByParent[parentPath]) {
    foldersByParent[parentPath] = [];
  }
  foldersByParent[parentPath].push(folder);
});

// Find and report conflicts
console.log('\nChecking for conflicts...');
let hasConflicts = false;

for (const [parentPath, folders] of Object.entries(foldersByParent)) {
  if (folders.length > 1) {
    console.log(`\nConflict found in ${parentPath}:`);
    folders.forEach(folder => console.log(`- ${folder}`));
    hasConflicts = true;
  }
}

if (!hasConflicts) {
  console.log('No conflicts found!');
}
