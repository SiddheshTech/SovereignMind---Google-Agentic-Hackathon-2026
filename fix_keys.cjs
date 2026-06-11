const fs = require('fs');

const files = [
  'ConstitutionalIntelligence.tsx',
  'SyntheticCivilizationSandbox.tsx',
  'ForesightDashboard.tsx',
  'DigitalTwinDashboard.tsx',
  'AnalyticsDashboard.tsx',
  'CrisisDashboard.tsx',
  'ProcurementDashboard.tsx',
  'IntelligenceGraphDashboard.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(`src/components/${file}`, 'utf8');
  content = content.replace(/interface\s+\w+Props\s*\{/g, match => match + '\n  key?: string;');
  fs.writeFileSync(`src/components/${file}`, content);
}
console.log('Added key?: string to all prop interfaces');
