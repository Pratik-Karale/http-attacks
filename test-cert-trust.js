const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');

console.log('🔒 Testing mkcert certificate trust...\n');

// Start HTTPS server
const serverProcess = exec('node server-https.js', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Server error:', error.message);
    }
});

// Wait for server to start
setTimeout(() => {
    console.log('🌐 Testing HTTPS connection to localhost:8443...');

    const options = {
        hostname: 'localhost',
        port: 8443,
        path: '/',
        method: 'GET',
        // Use default system CA
        rejectUnauthorized: true  // This is default
    };

    const req = https.request(options, (res) => {
        console.log(`✅ HTTPS request successful! Status: ${res.statusCode}`);
        console.log('🔐 Certificate is trusted by Node.js (system CA store).');
        console.log('\n📋 Response headers:');
        console.log('- Strict-Transport-Security:', res.headers['strict-transport-security']);
        console.log('- Content-Security-Policy:', res.headers['content-security-policy']?.substring(0, 50) + '...');

        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            if (data.includes('SecureShop')) {
                console.log('✅ Page content contains "SecureShop" - server is responding correctly.');
            }
            console.log('\n🎉 Certificate trust test PASSED!');
            console.log('The mkcert CA is properly installed and trusted.');
            console.log('Browsers should show a secure lock icon (no warnings).\n');
            serverProcess.kill();
            process.exit(0);
        });
    });

    req.on('error', (err) => {
        console.error('❌ HTTPS request failed:', err.message);
        if (err.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || err.code === 'CERT_UNTRUSTED') {
            console.error('🔴 Certificate is NOT trusted by the system.');
            console.error('Make sure mkcert CA is installed: run "mkcert -install" as administrator.');
        }
        serverProcess.kill();
        process.exit(1);
    });

    req.setTimeout(5000, () => {
        console.error('❌ Request timeout');
        serverProcess.kill();
        process.exit(1);
    });

    req.end();
}, 2000);

// Handle cleanup on exit
process.on('SIGINT', () => {
    serverProcess.kill();
    process.exit();
});