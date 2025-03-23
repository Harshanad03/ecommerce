const fs = require('fs');
const path = require('path');

// Function to safely remove a directory and its contents
function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // Recursive call for directories
        removeDirectory(curPath);
      } else {
        // Delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
    console.log(`Successfully removed: ${dir}`);
  }
}

// Path to the conflicting folder we want to remove
const conflictingFolder = path.join(__dirname, 'src', 'app', 'categories', '[id]');

// Remove the conflicting folder
console.log(`Attempting to remove conflicting folder: ${conflictingFolder}`);
removeDirectory(conflictingFolder);

console.log('Conflict resolution completed.');
