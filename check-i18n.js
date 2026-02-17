const fs = require('fs');
const path = require('path');

const namespaces = ['common', 'auth', 'dashboard', 'goals'];

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

let allPass = true;

namespaces.forEach(ns => {
  console.log(`\n=== ${ns}.json ===`);
  const enPath = path.join(__dirname, 'public', 'locales', 'en', `${ns}.json`);
  const koPath = path.join(__dirname, 'public', 'locales', 'ko', `${ns}.json`);
  
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const ko = JSON.parse(fs.readFileSync(koPath, 'utf8'));
  
  const enKeys = getKeys(en).sort();
  const koKeys = getKeys(ko).sort();
  
  console.log(`EN keys: ${enKeys.length}`);
  console.log(`KO keys: ${koKeys.length}`);
  
  const missing = enKeys.filter(k => !koKeys.includes(k));
  const extra = koKeys.filter(k => !enKeys.includes(k));
  
  if (missing.length > 0) {
    console.log('❌ Missing in KO:', missing);
    allPass = false;
  }
  if (extra.length > 0) {
    console.log('⚠️  Extra in KO:', extra);
  }
  
  const coverage = missing.length === 0 && extra.length === 0 ? '100%' : 'INCOMPLETE';
  console.log(`Coverage: ${coverage} ${missing.length === 0 ? '✅' : '❌'}`);
});

console.log(`\n=== FINAL RESULT ===`);
console.log(allPass ? '✅ All translations complete (100%)' : '❌ Some translations missing');
process.exit(allPass ? 0 : 1);
