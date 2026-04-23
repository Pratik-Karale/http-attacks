const https = require('https');

console.log('🔒 Testing HTTPS certificate trust (no extra CA certs)...');

const options = {
    hostname: 'localhost',
    port: 8443,
    path: '/',
    method: 'GET',
    rejectUnauthorized: true  // Default - should verify against system CA store
};

const req = https.request(options, (res) => {
    console.log(`✅ HTTPS request successful! Status: ${res.statusCode}`);
    console.log('🔐 Certificate is trusted by Node.js (system CA store).');
    console.log('\n📋 Security headers:');
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
        console.log('Browsers should show a secure lock icon (no warnings).');
        process.exit(0);
    });
});

req.on('error', (err) => {
    console.error('❌ HTTPS request failed:', err.message);
    if (err.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || err.code === 'CERT_UNTRUSTED' || err.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
        console.error('🔴 Certificate is NOT trusted by the system.');
        console.error('Make sure mkcert CA is installed: run "mkcert -install" as administrator.');
    }
    process.exit(1);
});

req.setTimeout(5000, () => {
    console.error('❌ Request timeout');
    process.exit(1);
});

req.end();