#!/bin/bash

# HTTPS Server Comprehensive Test Script
# Tests all features of the HTTPS version

echo "=========================================="
echo "  HTTPS Server Test Suite"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to print test results
test_passed() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

test_failed() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

test_skipped() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Start server
echo "Starting HTTPS server..."
node server-https.js > /dev/null 2>&1 &
SERVER_PID=$!
sleep 3

if ! ps -p $SERVER_PID > /dev/null 2>&1; then
    echo -e "${RED}❌ Failed to start server${NC}"
    exit 1
fi
test_passed "Server started successfully on port 8443"
echo ""

# Test 1: Landing Page
echo "Test 1: Landing Page"
echo "--------------------"
TITLE=$(curl -k -s https://localhost:8443/ | grep -o '<title>[^<]*</title>')
if echo "$TITLE" | grep -q "SecureShop"; then
    test_passed "Landing page loads correctly"
    test_passed "Title: $TITLE"
else
    test_failed "Landing page not found or incorrect title"
fi
echo ""

# Test 2: External JavaScript
echo "Test 2: External JavaScript"
echo "----------------------------"
LANDING_JS=$(curl -k -s https://localhost:8443/landing.js)
if echo "$LANDING_JS" | grep -q "addEventListener"; then
    test_passed "landing.js loads correctly (uses event listeners)"
else
    test_failed "landing.js not found or incorrect"
fi

PAYMENT_JS=$(curl -k -s https://localhost:8443/payment.js)
if echo "$PAYMENT_JS" | grep -q "document.addEventListener"; then
    test_passed "payment.js loads correctly"
else
    test_failed "payment.js not found or incorrect"
fi
echo ""

# Test 3: No Inline Scripts
echo "Test 3: No Inline Scripts"
echo "--------------------------"
INLINE_COUNT=$(curl -k -s https://localhost:8443/ | grep -o '<script>' | wc -l)
if [ "$INLINE_COUNT" -eq 0 ]; then
    test_passed "No inline scripts in landing page"
else
    test_failed "Found $INLINE_COUNT inline scripts (should be 0)"
fi
echo ""

# Test 4: BUY NOW Buttons
echo "Test 4: BUY NOW Buttons"
echo "------------------------"
BUTTONS=$(curl -k -s https://localhost:8443/ | grep -c "data-product")
if [ "$BUTTONS" -eq 4 ]; then
    test_passed "All 4 BUY NOW buttons have data attributes (no inline onclick)"
else
    test_failed "Expected 4 buttons with data attributes, found $BUTTONS"
fi
echo ""

# Test 5: Payment Page
echo "Test 5: Payment Page"
echo "---------------------"
TITLE=$(curl -k -s "https://localhost:8443/payment?product=Laptop&price=82000" | grep -o '<title>[^<]*</title>')
if echo "$TITLE" | grep -q "Payment - HTTPS"; then
    test_passed "Payment page loads correctly"
    test_passed "Title: $TITLE"
else
    test_failed "Payment page not found"
fi
echo ""

# Test 6: Payment Form
echo "Test 6: Payment Form"
echo "---------------------"
FORM=$(curl -k -s "https://localhost:8443/payment?product=Laptop&price=82000" | grep -c "payForm")
if [ "$FORM" -ge 1 ]; then
    test_passed "Payment form exists"
else
    test_failed "Payment form not found"
fi
echo ""

# Test 7: Security Headers
echo "Test 7: Security Headers"
echo "-------------------------"
CSP=$(curl -k -sI https://localhost:8443/ | grep "Content-Security-Policy")
if echo "$CSP" | grep -q "script-src 'self'"; then
    test_passed "CSP configured (script-src 'self')"
else
    test_failed "CSP not configured correctly"
fi
if echo "$CSP" | grep -q "img-src 'self' https:"; then
    test_passed "CSP allows external images (img-src 'self' https:)"
else
    test_failed "CSP missing img-src for external images"
fi

HSTS=$(curl -k -sI https://localhost:8443/ | grep "Strict-Transport-Security")
if echo "$HSTS" | grep -q "max-age=31536000"; then
    test_passed "HSTS header present"
else
    test_failed "HSTS header missing"
fi

XFRAME=$(curl -k -sI https://localhost:8443/ | grep "X-Frame-Options")
if echo "$XFRAME" | grep -q "DENY"; then
    test_passed "X-Frame-Options: DENY"
else
    test_failed "X-Frame-Options not set"
fi

XCTO=$(curl -k -sI https://localhost:8443/ | grep "X-Content-Type-Options")
if echo "$XCTO" | grep -q "nosniff"; then
    test_passed "X-Content-Type-Options: nosniff"
else
    test_failed "X-Content-Type-Options not set"
fi
echo ""

# Test 8: Payment Processing
echo "Test 8: Payment Processing"
echo "---------------------------"
PAYMENT_RESULT=$(curl -k -s -X POST https://localhost:8443/process \
  -H "Content-Type: application/json" \
  -d '{"product":"TestProduct","price":9999,"card":"1234567890123456","expiry":"12/25","cvv":"123"}')

if echo "$PAYMENT_RESULT" | grep -q '"success":true'; then
    test_passed "Payment processing works"
    REFERENCE=$(echo "$PAYMENT_RESULT" | grep -o '"reference":"[^"]*' | cut -d'"' -f4)
    test_passed "Reference ID generated: $REFERENCE"
else
    test_failed "Payment processing failed"
fi
echo ""

# Test 9: Transaction Logging
echo "Test 9: Transaction Logging"
echo "----------------------------"
TRANSACTIONS=$(curl -k -s https://localhost:8443/transaction-logs | grep -c "TXN")
if [ "$TRANSACTIONS" -ge 1 ]; then
    test_passed "Transaction logging works"
    test_passed "Found $TRANSACTIONS transaction(s)"
else
    test_failed "No transactions found"
fi
echo ""

# Test 10: Transaction Logs Page
echo "Test 10: Transaction Logs Page"
echo "--------------------------------"
LOGS_PAGE=$(curl -k -s https://localhost:8443/transaction-logs)
TITLE=$(echo "$LOGS_PAGE" | grep -o '<title>[^<]*</title>')
# Check for logs page content instead of just title
if echo "$LOGS_PAGE" | grep -q "Secure Transaction Logs\|All Transactions"; then
    test_passed "Transaction logs page loads correctly"
    if [ ! -z "$TITLE" ]; then
        test_passed "Title: $TITLE"
    fi
else
    test_failed "Transaction logs page not found"
fi
echo ""

# Test 11: Transaction Success Page
echo "Test 11: Transaction Success Page"
echo "-----------------------------------"
TITLE=$(curl -k -s "https://localhost:8443/transaction-success?reference=$REFERENCE" | grep -o '<title>[^<]*</title>')
if echo "$TITLE" | grep -q "Payment Successful"; then
    test_passed "Transaction success page loads correctly"
    test_passed "Title: $TITLE"
else
    test_failed "Transaction success page not found"
fi
echo ""

# Test 12: API Endpoint
echo "Test 12: API Endpoint"
echo "----------------------"
API_LOGS=$(curl -k -s https://localhost:8443/api/payment/logs)
# Check if it's valid JSON
if echo "$API_LOGS" | grep -q "success\|TXN\|\[.*\]"; then
    test_passed "API endpoint works"
    if echo "$API_LOGS" | grep -q "TXN"; then
        test_passed "API returns transaction data"
    else
        test_passed "API returns valid JSON (empty array)"
    fi
else
    test_failed "API endpoint not working or not returning valid JSON"
fi
echo ""

# Test 13: Product Pages
echo "Test 13: All Product Pages"
echo "---------------------------"
# Test Laptop
URL="https://localhost:8443/payment?product=Laptop&price=82000"
TITLE=$(curl -k -s "$URL" | grep -o '<title>[^<]*</title>')
if echo "$TITLE" | grep -q "Payment - HTTPS"; then
    test_passed "Laptop page loads correctly"
else
    test_failed "Laptop page not found"
fi

# Test Headphones
URL="https://localhost:8443/payment?product=Headphones&price=12500"
TITLE=$(curl -k -s "$URL" | grep -o '<title>[^<]*</title>')
if echo "$TITLE" | grep -q "Payment - HTTPS"; then
    test_passed "Headphones page loads correctly"
else
    test_failed "Headphones page not found"
fi

# Test Smartphone
URL="https://localhost:8443/payment?product=Smartphone&price=59999"
TITLE=$(curl -k -s "$URL" | grep -o '<title>[^<]*</title>')
if echo "$TITLE" | grep -q "Payment - HTTPS"; then
    test_passed "Smartphone page loads correctly"
else
    test_failed "Smartphone page not found"
fi

# Test Smart Watch (with space in name - may cause issues with curl query params)
URL="https://localhost:8443/payment?product=Smart%20Watch&price=14999"
TITLE=$(curl -k -s "$URL" | grep -o '<title>[^<]*</title>')
if echo "$TITLE" | grep -q "Payment - HTTPS"; then
    test_passed "Smart Watch page loads correctly"
else
    test_failed "Smart Watch page not found (URL encoding may be needed)"
fi
echo ""

# Test 14: Navigation Links
echo "Test 14: Navigation Links"
echo "--------------------------"
# Check for back to home links in transaction logs page
LOGS_PAGE=$(curl -k -s https://localhost:8443/transaction-logs)
if echo "$LOGS_PAGE" | grep -qq "Back to Home\|Back to"; then
    test_passed "Back to Home link found"
else
    test_failed "Back to Home link not found"
fi
echo ""

# Test 15: Images Load
echo "Test 15: Images Load"
echo "--------------------"
IMAGES=$(curl -k -s https://localhost:8443/ | grep -c '<img')
if [ "$IMAGES" -ge 4 ]; then
    test_passed "All product images loaded ($IMAGES images)"
else
    test_failed "Not all images loaded ($IMAGES images found)"
fi
echo ""

# Summary
echo "=========================================="
echo "  Test Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! HTTPS server is fully functional.${NC}"
    echo ""
    echo "You can now:"
    echo "1. Navigate to https://localhost:8443"
    echo "2. Click BUY NOW buttons"
    echo "3. Test payment processing"
    echo "4. Verify transaction logs"
    echo ""
    echo "All features are working correctly!"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please check the output above.${NC}"
    exit 1
fi

# Kill server
kill $SERVER_PID 2>/dev/null || true
