const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

function checkJSX() {
  const Babel = require('@babel/core');
  try {
    Babel.transformSync(content, {
      presets: ['@babel/preset-typescript', '@babel/preset-react'],
      filename: 'App.tsx'
    });
    console.log("SUCCESS");
  } catch(e) {
    console.log(e.message);
  }
}
checkJSX();
