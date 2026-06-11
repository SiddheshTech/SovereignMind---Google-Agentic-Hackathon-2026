const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/console\.log\([^)]*due to Gemini API limit or error:[^)]*\);/g, '');
fs.writeFileSync('server.ts', content);

console.log('Removed simulated warnings from server.ts');
