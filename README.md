# Web Security Demonstration Project

## 📋 Project Overview

This project demonstrates the critical differences between HTTP and HTTPS security, specifically focusing on:

1. **HTTP Vulnerabilities**: Content tampering and payment gateway interception
2. **Payment Gateway Security**: How credit card data can be stolen over HTTP
3. **HTTPS Protection**: How SSL/TLS encryption secures data transmission

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd web-security-demo

# Install dependencies
npm install
```

### SSL Certificate Generation

For the HTTPS server, you need a self-signed SSL certificate:

```bash
npm run generate-cert
```

This will generate `key.pem` and `cert.pem` files in the project root.

### Running the Servers

#### HTTP Server (Insecure Version)

```bash
npm run start-http
```

Server will start on `http://localhost:3000`

⚠️ **Security Warning**: This server is INSECURE and demonstrates vulnerabilities!

#### HTTPS Server (Secure Version)

```bash
npm run start-https
```

Server will start on `https://localhost:8443`

✅ **Security Note**: This server uses TLS/SSL encryption!

### Taking Screenshots

#### HTTP Screenshots

```bash
npm run take-http-screenshots
```

#### HTTPS Screenshots

```bash
npm run take-https-screenshots
```

## 📊 Project Structure

```
web-security-demo/
├── insecure-http/          # HTTP version (vulnerable)
├── secure-https/           # HTTPS version (secure)
├── templates/              # HTML templates
├── screenshots/            # Playwright screenshots
│   ├── http-insecure/      # HTTP vulnerability screenshots
│   └── https-secure/       # HTTPS security screenshots
├── docs/                   # Documentation
│   ├── README.md
│   └── SECURITY_ANALYSIS.md
├── server-http.js          # HTTP server with vulnerabilities
├── server-https.js         # HTTPS server with security features
├── take-screenshots-http.js    # Playwright script for HTTP
├── take-screenshots-https.js   # Playwright script for HTTPS
└── package.json
```

## 🔒 Security Vulnerabilities Demonstrated (HTTP)

### 1. Content Tampering
- **Issue**: Page content can be modified during transmission
- **Impact**: Attackers can change prices, product details, or messages
- **Demo**: Open browser dev tools → Network tab → Intercept and modify response

### 2. Payment Gateway Interception
- **Issue**: Credit card data sent in cleartext (HTTP)
- **Impact**: Attackers can intercept and steal credit card numbers
- **Demo**: Use proxy tools to capture payment form data

### 3. Transaction Logs Exposure
- **Issue**: All transaction logs visible over HTTP
- **Impact**: Complete payment history including card numbers accessible
- **Demo**: Visit `/transaction-logs` endpoint

### 4. No Server-Side Validation
- **Issue**: No input validation on server
- **Impact**: Invalid card numbers can be processed
- **Demo**: Try submitting invalid card data

## 🔐 Security Features (HTTPS)

### 1. TLS/SSL Encryption
- All data encrypted with TLS 1.2+
- Prevents man-in-the-middle attacks
- Encrypts payment information end-to-end

### 2. Security Headers
- **Content-Security-Policy**: Prevents XSS attacks
- **Strict-Transport-Security**: Forces HTTPS only
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing

### 3. Server-Side Validation
- Validates all input data
- Checks card number format
- Validates required fields

### 4. HTTPS-Only Mode
- Redirects HTTP to HTTPS
- Ensures secure connection

## 📸 Screenshots

The project includes automated screenshots showing:

### HTTP Vulnerabilities
- `landing-page.png` - Unsecure homepage
- `payment-page.png` - Unsecure payment form
- `payment-form-filled.png` - Payment data without encryption
- `transaction-logs.png` - Exposed transaction data

### HTTPS Security
- `landing-page.png` - Secure homepage with lock icon
- `payment-page.png` - Secure payment page
- `payment-form-filled.png` - Encrypted payment data
- `transaction-logs.png` - Secure transaction logs

## 🎯 Attack Demonstration Guide

### Content Tampering Attack

1. Start HTTP server: `npm run start-http`
2. Open browser and navigate to `http://localhost:3000`
3. Open Developer Tools (F12)
4. Go to Network tab
5. Make a request and intercept the response
6. Modify the product price or content
7. See the changes reflected immediately

### Payment Interception Attack

1. Start HTTP server: `npm run start-http`
2. Use a proxy tool like Charles or Burp Suite
3. Intercept the payment form submission
4. Modify the credit card number or amount
5. See the attack succeed

### HTTPS Protection

1. Start HTTPS server: `npm run start-https`
2. Navigate to `https://localhost:8443`
3. Observe the secure lock icon in the browser
4. Compare with HTTP version
5. Notice encrypted connection indicator

## 📚 Documentation

- `SECURITY_ANALYSIS.md` - Detailed security analysis
- `REPORT.md` - Complete project report
- `PRESENTATION.md` - Presentation slides

## 🛡️ OWASP Top 10 Vulnerabilities

This project demonstrates:
- **A1: Broken Access Control** - Transaction logs accessible
- **A2: Cryptographic Failures** - Unencrypted HTTP communication
- **A3: Injection** - No input validation
- **A7: XSS** - Potential cross-site scripting (via CSP headers in HTTPS)

## 📖 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Digital Identity Guidelines](https://csrc.nist.gov/projects/digital-identity-guidelines)
- [Mozilla Security Headers](https://infosec.mozilla.org/guidelines/web_security)
- [TLS Best Practices](https://wiki.mozilla.org/Security/Server_Side_TLS)

## ⚠️ Security Considerations

- **Self-Signed Certificate**: Used for demonstration only
- **No Real Payments**: Simulated data only
- **Local Testing**: Not meant for production
- **Educational Purposes**: Security awareness training

## 📝 License

This project is for educational purposes only.

## 👥 Contributors

- Security Research Project

---

**⚠️ WARNING**: This project is for educational purposes only. Do not use for any real-world applications without proper security measures in place.
"# http-attacks" 
