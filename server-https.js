const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8443;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (req.protocol === 'http') {
        return res.redirect(`https://${req.get('host')}${req.url}`);
    }
    next();
});

app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https:;");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureShop - HTTPS Version (SECURED)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .container { max-width: 1000px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; }
        .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
        .product { border: 1px solid #ddd; padding: 15px; text-align: center; }
        .product img { width: 100%; height: 150px; object-fit: cover; border-radius: 4px; }
        .price { font-size: 24px; color: #4CAF50; font-weight: bold; }
        .btn { padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; }
        .success { background: #d4edda; color: #155724; padding: 15px; margin: 20px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 SecureShop <span style="background: #4CAF50; padding: 5px 15px; border-radius: 12px; margin-left: 10px;">SECURE</span></h1>
        <p>✓ Your connection is encrypted with TLS/SSL</p>
    </div>
    <div class="container">
        <div class="success">
            <strong>✓ SECURE CONNECTION:</strong> Data is encrypted! No one can intercept your information!
        </div>
        <h2>Featured Products</h2>
        <div class="products">
            <div class="product">
                <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=150&fit=crop" alt="Laptop">
                <h3>High-Performance Laptop</h3>
                <p class="price">₹82,000</p>
                <button class="btn" data-product="Laptop" data-price="82000">Buy Now</button>
            </div>
            <div class="product">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=150&fit=crop" alt="Headphones">
                <h3>Premium Headphones</h3>
                <p class="price">₹12,500</p>
                <button class="btn" data-product="Headphones" data-price="12500">Buy Now</button>
            </div>
            <div class="product">
                <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=150&fit=crop" alt="Smartphone">
                <h3>Latest Smartphone</h3>
                <p class="price">₹59,999</p>
                <button class="btn" data-product="Smartphone" data-price="59999">Buy Now</button>
            </div>
            <div class="product">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=150&fit=crop" alt="Smart Watch">
                <h3>Sport Smart Watch</h3>
                <p class="price">₹14,999</p>
                <button class="btn" data-product="Smart Watch" data-price="14999">Buy Now</button>
            </div>
        </div>
    </div>
    <script src="/landing.js"></script>
</body>
</html>`);
});

app.get('/payment', (req, res) => {
    const product = req.query.product || 'Product';
    const price = req.query.price || 0;
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment - HTTPS (SECURED)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; }
        .success { background: #d4edda; color: #155724; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .pay-btn { width: 100%; padding: 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 18px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💳 Payment - HTTPS SECURED <span style="background: #4CAF50; padding: 5px 15px; border-radius: 12px; margin-left: 10px;">LOCK</span></h1>
    </div>
    <div class="container">
        <div class="success">
            <strong>✓ SECURE:</strong> Payment is encrypted with TLS! Card data cannot be intercepted!
        </div>
        <h2>Order: ${product} - ₹${price.toLocaleString('en-IN')}</h2>
        <form id="payForm">
            <div class="form-group">
                <label>Card Number:</label>
                <input type="text" id="card" required placeholder="4242 4242 4242 4242">
            </div>
            <div class="form-group">
                <label>Expiry:</label>
                <input type="text" id="expiry" required placeholder="12/25">
            </div>
            <div class="form-group">
                <label>CVV:</label>
                <input type="text" id="cvv" required placeholder="123">
            </div>
            <button type="submit" class="pay-btn">Pay ₹${price.toLocaleString('en-IN')}</button>
        </form>
    </div>
    <script src="/payment.js"></script>
</body>
</html>`);
});

// Transaction logs storage
let transactionLogs = [];

app.post('/process', (req, res) => {
    const cardData = req.body;
    console.log('Secure Payment:', cardData);

    // Log transaction securely
    const transaction = {
        reference: 'TXN' + Date.now(),
        timestamp: new Date().toISOString(),
        product: cardData.product,
        amount: cardData.price,
        cardNumber: cardData.card,
        expiry: cardData.expiry,
        cvv: cardData.cvv,
        status: 'success'
    };

    transactionLogs.push(transaction);

    // Send response
    res.json({
        success: true,
        reference: transaction.reference,
        message: 'Payment received over HTTPS'
    });
});

// Transaction Success Page
app.get('/transaction-success', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .success-box {
            background: white;
            padding: 40px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border: 3px solid #4CAF50;
        }
        .success-icon {
            font-size: 60px;
            color: #4CAF50;
            margin-bottom: 20px;
        }
        .success-box h1 {
            color: #4CAF50;
            margin-top: 0;
        }
        .success-box p {
            font-size: 18px;
            color: #666;
        }
        .btn {
            margin-top: 20px;
            padding: 10px 30px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: background 0.3s;
        }
        .btn:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <div class="success-box">
        <div class="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Your transaction has been processed securely.</p>
        <p>Reference: ${req.query.reference}</p>
        <p><strong>🔒 All data was encrypted with TLS/SSL!</strong></p>
        <a href="/" class="btn">Return to Home</a>
    </div>
</body>
</html>`;
    res.send(html);
});

// API endpoint to get transaction logs (secure)
app.get('/api/payment/logs', (req, res) => {
    res.json(transactionLogs);
});

// Transaction Logs Page
app.get('/transaction-logs', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Logs - Securely Logged</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 15px;
            text-align: center;
        }
        .container {
            max-width: 1000px;
            margin: 20px auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Secure Transaction Logs</h1>
        <p>🔒 All transactions are logged securely with TLS encryption</p>
    </div>
    <div class="container">
        <div class="success">
            <strong>✓ SECURE:</strong> Transaction logs are transmitted and stored securely!
        </div>
        <h2>All Transactions</h2>
        <table>
            <thead>
                <tr>
                    <th>Reference</th>
                    <th>Timestamp</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Card Number (masked)</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${transactionLogs.map(log => `
                    <tr>
                        <td>${log.reference}</td>
                        <td>${log.timestamp}</td>
                        <td>${log.product}</td>
                        <td>₹${log.amount.toLocaleString('en-IN')}</td>
                        <td>•••• •••• •••• ${log.cardNumber.slice(-4)}</td>
                        <td><span style="color: green;">${log.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <a href="/" style="display: inline-block; margin-top: 20px; color: #4CAF50; text-decoration: none;">← Back to Home</a>
    </div>
</body>
</html>`;
    res.send(html);
});

const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost-chain.pem')
};

https.createServer(options, app).listen(PORT, () => {
    console.log('========================================');
    console.log('🌐 HTTPS Server running on port ' + PORT);
    console.log('✅ CONNECTION SECURED with TLS/SSL!');
    console.log('========================================');
    console.log('\nEndpoints:');
    console.log('1. Home Page: https://localhost:' + PORT);
    console.log('2. Products Page: https://localhost:' + PORT + '/');
    console.log('3. Payment Page: https://localhost:' + PORT + '/payment');
    console.log('4. Transaction Success: https://localhost:' + PORT + '/transaction-success');
    console.log('5. Transaction Logs: https://localhost:' + PORT + '/transaction-logs');
    console.log('6. View Logs API: https://localhost:' + PORT + '/api/payment/logs');
    console.log('========================================');
    console.log('\nSecurity Features:');
    console.log('✓ TLS/SSL Encryption');
    console.log('✓ Content Security Policy');
    console.log('✓ Strict-Transport-Security');
    console.log('✓ X-Frame-Options: DENY');
    console.log('✓ X-Content-Type-Options: nosniff');
    console.log('========================================\n');
});
