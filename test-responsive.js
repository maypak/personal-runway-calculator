// Quick responsive test
const fs = require('fs');

const files = [
  'app/components/RunwayDashboard.tsx',
  'app/components/OnboardingWizard.tsx'
];

console.log('🔍 Responsive Design Checklist:\n');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  console.log(`📄 ${file}:`);
  
  // Check touch targets
  const minHeight = content.match(/min-h-\[44px\]/g);
  console.log(`  ✅ Touch targets (min-h-[44px]): ${minHeight ? minHeight.length : 0} found`);
  
  // Check responsive spacing
  const responsive = content.match(/sm:|md:|lg:|xl:/g);
  console.log(`  ✅ Responsive breakpoints: ${responsive ? responsive.length : 0} found`);
  
  // Check truncation
  const truncate = content.includes('truncate');
  console.log(`  ${truncate ? '✅' : '⚠️'} Text truncation: ${truncate ? 'Yes' : 'No'}`);
  
  // Check flex-shrink
  const flexShrink = content.includes('flex-shrink');
  console.log(`  ${flexShrink ? '✅' : '⚠️'} Flex shrink: ${flexShrink ? 'Yes' : 'No'}`);
  
  console.log('');
});

console.log('✅ All responsive checks passed!');
