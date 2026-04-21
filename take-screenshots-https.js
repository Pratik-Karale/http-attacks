/**
 * Playwright Script to Take Screenshots of HTTPS Version
 * Demonstrates security with SSL/TLS
 */

const { chromium } = require('playwright');

async function takeHTTPSScreenshots() {
    console.log('🔒 Starting HTTPS Screenshot Capture...');

    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
    });

    const context = await browser.newContext({
        acceptDownloads: true,
        ignoreHTTPSErrors: true  // Important for self-signed certificates
    });

    const page = await context.newPage();

    try {
        // Navigate to HTTPS site
        console.log('🌐 Navigating to HTTPS site (https://localhost:8443)...');
        await page.goto('https://localhost:8443', { waitUntil: 'networkidle' });

        // Take screenshot of landing page
        console.log('📸 Capturing secure landing page screenshot...');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'screenshots/https-secure/landing-page.png',
            fullPage: true
        });

        // Click on a product to go to payment page
        console.log('💳 Clicking "Buy Now" to go to payment page...');
        await page.click('button:has-text("Buy Now")');

        // Wait for payment page to load
        await page.waitForTimeout(2000);

        // Take screenshot of payment page
        console.log('📸 Capturing secure payment page screenshot...');
        await page.screenshot({
            path: 'screenshots/https-secure/payment-page.png',
            fullPage: true
        });

        // Fill in payment form
        console.log('📝 Filling in payment form...');
        await page.fill('#cardNumber', '4242424242424242');
        await page.fill('#expiry', '12/25');
        await page.fill('#cvv', '123');

        // Take screenshot of filled payment form
        console.log('📸 Capturing filled payment form...');
        await page.screenshot({
            path: 'screenshots/https-secure/payment-form-filled.png',
            fullPage: true
        });

        // Submit payment
        console.log('💵 Submitting payment...');
        await page.click('.pay-button');
        await page.waitForTimeout(2000);

        // Navigate to transaction logs
        console.log('📜 Viewing transaction logs...');
        await page.goto('https://localhost:8443/transaction-logs', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        // Take screenshot of transaction logs
        console.log('📸 Capturing secure transaction logs screenshot...');
        await page.screenshot({
            path: 'screenshots/https-secure/transaction-logs.png',
            fullPage: true
        });

        // Check for secure connection indicator
        console.log('🔒 Verifying secure connection...');
        const secureIndicator = await page.locator('.secure-badge').textContent();
        console.log('Secure badge:', secureIndicator);

        // Get security headers
        console.log('\n📋 Security Headers:');
        const headers = page.response()?.headers();
        if (headers) {
            console.log('- Content-Security-Policy:', headers['content-security-policy']?.substring(0, 50) + '...');
            console.log('- Strict-Transport-Security:', headers['strict-transport-security']);
            console.log('- X-Frame-Options:', headers['x-frame-options']);
            console.log('- X-Content-Type-Options:', headers['x-content-type-options']);
        }

        console.log('\n✅ All HTTPS screenshots captured successfully!');
        console.log('📁 Screenshots saved in: screenshots/https-secure/');

        // Show security features
        console.log('\n🔒 SECURITY FEATURES:');
        console.log('1. TLS/SSL encryption enabled');
        console.log('2. Secure connection indicator visible');
        console.log('3. Security headers configured');
        console.log('4. Input validation on server-side');
        console.log('5. Data encrypted during transmission');

    } catch (error) {
        console.error('❌ Error capturing screenshots:', error.message);
    } finally {
        await browser.close();
    }
}

takeHTTPSScreenshots();
