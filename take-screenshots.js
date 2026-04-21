const { chromium } = require('playwright');

async function takeScreenshots() {
    const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('📸 Starting HTTP Screenshot Capture...\n');

    // Start HTTP server
    console.log('🌐 Starting HTTP server on port 3000...');
    const httpServer = require('child_process').spawn('node', ['server.js'], { cwd: __dirname });
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        // Navigate to HTTP site
        console.log('Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

        // Take screenshot of HTTP landing page
        console.log('📸 Capturing HTTP landing page...');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'screenshots/http-landing.png', fullPage: true });

        // Click buy button
        console.log('💳 Clicking buy button...');
        await page.click('button');
        await page.waitForTimeout(2000);

        // Take screenshot of payment page
        console.log('📸 Capturing HTTP payment page...');
        await page.screenshot({ path: 'screenshots/http-payment.png', fullPage: true });

        // Fill payment form
        console.log('📝 Filling payment form...');
        await page.fill('#card', '4242424242424242');
        await page.fill('#expiry', '12/25');
        await page.fill('#cvv', '123');

        await page.screenshot({ path: 'screenshots/http-payment-filled.png', fullPage: true });

        // Submit payment
        console.log('💵 Submitting payment...');
        await page.click('.pay-btn');
        await page.waitForTimeout(2000);

        console.log('\n✅ HTTP screenshots captured!\n');

        // Now HTTPS
        console.log('🌐 Starting HTTPS server on port 8443...');
        const httpsServer = require('child_process').spawn('node', ['server-https.js'], { cwd: __dirname });
        await new Promise(resolve => setTimeout(resolve, 3000));

        try {
            // Navigate to HTTPS site
            console.log('Navigating to https://localhost:8443...');
            await page.goto('https://localhost:8443', { waitUntil: 'networkidle' });

            // Take screenshot of HTTPS landing page
            console.log('📸 Capturing HTTPS landing page...');
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'screenshots/https-landing.png', fullPage: true });

            // Click buy button
            console.log('💳 Clicking buy button...');
            await page.click('button');
            await page.waitForTimeout(2000);

            // Take screenshot of HTTPS payment page
            console.log('📸 Capturing HTTPS payment page...');
            await page.screenshot({ path: 'screenshots/https-payment.png', fullPage: true });

            // Fill payment form
            console.log('📝 Filling payment form...');
            await page.fill('#card', '4242424242424242');
            await page.fill('#expiry', '12/25');
            await page.fill('#cvv', '123');

            await page.screenshot({ path: 'screenshots/https-payment-filled.png', fullPage: true });

            // Submit payment
            console.log('💵 Submitting payment...');
            await page.click('.pay-btn');
            await page.waitForTimeout(2000);

            console.log('\n✅ All screenshots captured successfully!\n');

        } finally {
            httpsServer.kill();
        }

    } finally {
        httpServer.kill();
        await browser.close();
    }
}

takeScreenshots();
