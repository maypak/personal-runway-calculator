#!/bin/bash
# Lighthouse Performance Audit for Personal Runway Calculator

URL="https://personal-runway-calculator.vercel.app"
OUTPUT_DIR="$(dirname "$0")/../lighthouse-reports"
TIMESTAMP=$(date +%Y-%m-%d-%H-%M)

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🔍 Running Lighthouse audit on $URL..."
echo ""

# Run Lighthouse
lighthouse "$URL" \
  --output html \
  --output json \
  --output-path "$OUTPUT_DIR/report-$TIMESTAMP" \
  --chrome-flags="--headless" \
  --quiet

# Extract scores from JSON
JSON_FILE="$OUTPUT_DIR/report-$TIMESTAMP.report.json"

if [ -f "$JSON_FILE" ]; then
  echo ""
  echo "✅ Lighthouse audit complete!"
  echo ""
  echo "📊 Scores:"
  
  # Use node to parse JSON (cross-platform)
  node -e "
    const fs = require('fs');
    const report = JSON.parse(fs.readFileSync('$JSON_FILE', 'utf8'));
    const cats = report.categories;
    
    console.log('  Performance:   ', Math.round(cats.performance.score * 100) + '/100');
    console.log('  Accessibility: ', Math.round(cats.accessibility.score * 100) + '/100');
    console.log('  Best Practices:', Math.round(cats['best-practices'].score * 100) + '/100');
    console.log('  SEO:           ', Math.round(cats.seo.score * 100) + '/100');
  "
  
  echo ""
  echo "📄 Reports saved:"
  echo "  - HTML: $OUTPUT_DIR/report-$TIMESTAMP.report.html"
  echo "  - JSON: $OUTPUT_DIR/report-$TIMESTAMP.report.json"
  echo ""
  echo "👀 To view HTML report:"
  echo "  open $OUTPUT_DIR/report-$TIMESTAMP.report.html"
else
  echo "❌ Failed to generate report"
  exit 1
fi
