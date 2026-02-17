#!/bin/bash
# Comprehensive Lighthouse Audit - All Pages
# Tests: /, /fire, /scenarios, /phases

OUTPUT_DIR="$(dirname "$0")/../lighthouse-reports"
TIMESTAMP=$(date +%Y-%m-%d-%H-%M)
REPORT_DIR="$OUTPUT_DIR/$TIMESTAMP"

# Create output directory
mkdir -p "$REPORT_DIR"

echo "🚀 Starting production server..."
echo ""

# Build if not already built
if [ ! -d "$(dirname "$0")/../.next" ]; then
  echo "📦 Building first..."
  npm run build
fi

# Start production server in background
npm run start &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Base URL
URL="http://localhost:3000"

# Pages to audit
PAGES=("/" "/fire" "/scenarios" "/phases")
PAGE_NAMES=("home" "fire" "scenarios" "phases")

echo "🔍 Running Lighthouse audits..."
echo ""

# Run audit for each page
for i in "${!PAGES[@]}"; do
  PAGE="${PAGES[$i]}"
  NAME="${PAGE_NAMES[$i]}"
  
  echo "Testing: $URL$PAGE ($NAME)"
  
  lighthouse "$URL$PAGE" \
    --output html \
    --output json \
    --output-path "$REPORT_DIR/$NAME" \
    --chrome-flags="--headless --disable-gpu" \
    --quiet \
    --only-categories=performance,accessibility,best-practices,seo

  echo "✓ $NAME complete"
  echo ""
done

# Stop server
kill $SERVER_PID 2>/dev/null

echo ""
echo "📊 RESULTS SUMMARY"
echo "=================="
echo ""

# Extract and display scores
for i in "${!PAGE_NAMES[@]}"; do
  NAME="${PAGE_NAMES[$i]}"
  JSON_FILE="$REPORT_DIR/$NAME.report.json"
  
  if [ -f "$JSON_FILE" ]; then
    echo "📄 $NAME:"
    node -e "
      const fs = require('fs');
      const report = JSON.parse(fs.readFileSync('$JSON_FILE', 'utf8'));
      const cats = report.categories;
      
      const perf = Math.round(cats.performance.score * 100);
      const a11y = Math.round(cats.accessibility.score * 100);
      const bp = Math.round(cats['best-practices'].score * 100);
      const seo = Math.round(cats.seo.score * 100);
      
      console.log('  Performance:    ' + perf + '/100 ' + (perf >= 90 ? '✅' : perf >= 50 ? '⚠️' : '❌'));
      console.log('  Accessibility:  ' + a11y + '/100 ' + (a11y >= 90 ? '✅' : a11y >= 50 ? '⚠️' : '❌'));
      console.log('  Best Practices: ' + bp + '/100 ' + (bp >= 90 ? '✅' : bp >= 50 ? '⚠️' : '❌'));
      console.log('  SEO:            ' + seo + '/100 ' + (seo >= 90 ? '✅' : seo >= 50 ? '⚠️' : '❌'));
    "
    echo ""
  fi
done

echo "📁 Reports saved to: $REPORT_DIR"
echo ""
echo "👀 To view reports:"
echo "  open $REPORT_DIR/*.report.html"
