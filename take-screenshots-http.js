/**
 * Playwright Script to Take Screenshots of HTTP Version
 * Demonstrates security vulnerabilities
 */

const { chromium } = require('playwright');

async function takeHTTPScreenshots() {
    console.log('🚀 Starting HTTP Screenshot Capture...');

    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
    });

    const context = await browser.newContext({
        acceptDownloads: true
    });

    const page = await context.newPage();

    try {
        // Navigate to HTTP site
        console.log('🌐 Navigating to HTTP site (http://localhost:3000)...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

        // Take screenshot of landing page
        console.log('📸 Capturing landing page screenshot...');
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'screenshots/http-insecure/landing-page.png',
            fullPage: true
        });

        // Click on a product to go to payment page
        console.log('💳 Clicking "Buy Now" to go to payment page...');
        await page.click('button:has-text("Buy Now")');

        // Wait for payment page to load
        await page.waitForTimeout(2000);

        // Take screenshot of payment page
        console.log('📸 Capturing payment page screenshot...');
        await page.screenshot({
            path: 'screenshots/http-insecure/payment-page.png',
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
            path: 'screenshots/http-insecure/payment-form-filled.png',
            fullPage: true
        });

        // Submit payment
        console.log('💵 Submitting payment...');
        await page.click('.pay-button');
        await page.waitForTimeout(2000);

        // Navigate to transaction logs
        console.log('📜 Viewing transaction logs...');
        await page.goto('http://localhost:3000/transaction-logs', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        // Take screenshot of transaction logs
        console.log('📸 Capturing transaction logs screenshot...');
        await page.screenshot({
            path: 'screenshots/http-insecure/transaction-logs.png',
            fullPage: true
        });

        console.log('\n✅ All HTTP screenshots captured successfully!');
        console.log('📁 Screenshots saved in: screenshots/http-insecure/');

        // Show vulnerabilities detected
        console.log('\n⚠️  SECURITY VULNERABILITIES DETECTED:');
        console.log('1. HTTP protocol - data sent in cleartext');
        console.log('2. No SSL/TLS encryption');
        console.log('3. Credit card numbers can be intercepted');
        console.log('4. Transaction logs accessible to attackers');
        console.log('5. No server-side validation');

    } catch (error) {
        console.error('❌ Error capturing screenshots:', error.message);
    } finally {
        await browser.close();
    }
}

takeHTTPScreenshots();
