/**
 * SSL Certificate Generator
 * Creates self-signed certificate for HTTPS server
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔒 Generating Self-Signed SSL Certificate...\n');

// Configuration
const config = {
    commonName: 'localhost',
    organization: 'Security Demo',
    organizationalUnit: 'IT',
    country: 'IN',
    state: 'Maharashtra',
    locality: 'Mumbai',
    validityDays: 365
};

try {
    // Create OpenSSL configuration
    const opensslConfig = `
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[dn]
C = ${config.country}
ST = ${config.state}
L = ${config.locality}
O = ${config.organization}
OU = ${config.organizationalUnit}
CN = ${config.commonName}

[req_exts]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
`;

    // Write config file
    fs.writeFileSync('openssl.cnf', opensslConfig);

    // Generate private key
    console.log('1️⃣  Generating private key...');
    execSync('openssl genrsa -out key.pem 2048', { stdio: 'inherit' });

    // Generate CSR
    console.log('2️⃣  Generating Certificate Signing Request...');
    execSync(`openssl req -new -key key.pem -out csr.pem -config openssl.cnf`, { stdio: 'inherit' });

    // Generate self-signed certificate
    console.log('3️⃣  Generating self-signed certificate...');
    execSync(`openssl x509 -req -days ${config.validityDays} -in csr.pem -signkey key.pem -out cert.pem -extensions req_exts -extfile openssl.cnf`, { stdio: 'inherit' });

    // Clean up
    fs.unlinkSync('csr.pem');
    fs.unlinkSync('openssl.cnf');

    console.log('\n✅ Certificate Generated Successfully!');
    console.log(`📄 Certificate: cert.pem`);
    console.log(`🔑 Private Key: key.pem`);
    console.log(`📅 Validity: ${config.validityDays} days`);
    console.log(`🏢 Organization: ${config.organization}`);
    console.log(`🌐 Common Name: ${config.commonName}`);
    console.log('\n🔒 Certificate details:');
    console.log(execSync('openssl x509 -in cert.pem -text -noout', { encoding: 'utf-8' }));

} catch (error) {
    console.error('❌ Error generating certificate:', error.message);
    process.exit(1);
}
