#!/bin/bash
# Lighthouse accessibility audit script

URL="https://personal-runway-calculator.vercel.app"

echo "🔍 Running Lighthouse accessibility audit..."
echo "URL: $URL"
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "❌ Lighthouse CLI not found"
    echo "Install: npm install -g lighthouse"
    exit 1
fi

# Run lighthouse with accessibility category only
lighthouse "$URL" \
  --only-categories=accessibility \
  --output=json \
  --output-path=./lighthouse-a11y-report.json \
  --quiet

# Extract score
SCORE=$(cat lighthouse-a11y-report.json | grep -o '"accessibility":[0-9.]*' | grep -o '[0-9.]*')
SCORE_PCT=$(echo "$SCORE * 100" | bc)

echo ""
echo "✅ Audit complete!"
echo "Accessibility Score: $SCORE_PCT/100"
echo ""
echo "Full report: lighthouse-a11y-report.json"
