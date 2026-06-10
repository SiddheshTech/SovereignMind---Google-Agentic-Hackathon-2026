const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/console\.log\([^,]+,\s*e\.message\);/g, (match) => {
  return match.replace(/,\s*e\.message/, '');
});
fs.writeFileSync('server.ts', content);
