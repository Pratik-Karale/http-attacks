/**
 * HTTP Server - INSECURE VERSION
 * Demonstrates vulnerabilities: Content tampering, Payment gateway interception
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'templates')));

// In-memory transaction log
let transactionLogs = [];

// Landing Page Route
app.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureShop - Buy Online Safely</title>
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
        .products {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .product {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            transition: transform 0.2s;
        }
        .product:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .product img {
            max-width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 4px;
        }
        .product h3 {
            margin: 10px 0;
            color: #333;
        }
        .product .price {
            font-size: 24px;
            color: #4CAF50;
            font-weight: bold;
        }
        .product button {
            margin-top: 15px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .product button:hover {
            background-color: #45a049;
        }
        .alert {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
        }
        .badge {
            display: inline-block;
            background-color: #ff4444;
            color: white;
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 SecureShop <span class="badge">SECURE SITE</span></h1>
        <p>Your trusted online shopping destination</p>
    </div>
    <div class="container">
        <div class="alert">
            <strong>⚠️ NOTICE:</strong> This is an HTTP (not HTTPS) connection! Your data is not encrypted and can be intercepted by attackers.
        </div>
        <h2>Featured Products</h2>
        <div class="products">
            <div class="product">
                <img src="https://via.placeholder.com/300x150/4CAF50/FFFFFF?text=Laptop" alt="Laptop">
                <h3>High-Performance Laptop</h3>
                <p class="price">$999.00</p>
                <button onclick="navigateToPayment(999.00, 'Laptop')">Buy Now</button>
            </div>
            <div class="product">
                <img src="https://via.placeholder.com/300x150/2196F3/FFFFFF?text=Headphones" alt="Headphones">
                <h3>Premium Headphones</h3>
                <p class="price">$149.00</p>
                <button onclick="navigateToPayment(149.00, 'Headphones')">Buy Now</button>
            </div>
            <div class="product">
                <img src="https://via.placeholder.com/300x150/FF9800/FFFFFF?text=Smartphone" alt="Smartphone">
                <h3>Latest Smartphone</h3>
                <p class="price">$699.00</p>
                <button onclick="navigateToPayment(699.00, 'Smartphone')">Buy Now</button>
            </div>
            <div class="product">
                <img src="https://via.placeholder.com/300x150/9C27B0/FFFFFF?text=Watch" alt="Smart Watch">
                <h3>Sport Smart Watch</h3>
                <p class="price">$299.00</p>
                <button onclick="navigateToPayment(299.00, 'Smart Watch')">Buy Now</button>
            </div>
        </div>
    </div>

    <script>
        function navigateToPayment(amount, product) {
            window.location.href = '/payment?amount=' + amount + '&product=' + product;
        }

        console.log('⚠️ WARNING: Using HTTP protocol - Your data is vulnerable to interception!');
    </script>
</body>
</html>`;
    res.send(html);
});

// Payment Page Route
app.get('/payment', (req, res) => {
    const amount = parseFloat(req.query.amount) || 0;
    const product = req.query.product || 'Unknown Product';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureShop - Secure Payment</title>
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
            max-width: 600px;
            margin: 20px auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .product-info {
            background-color: #e8f5e9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .product-info h2 {
            color: #4CAF50;
            margin-top: 0;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .form-group input:focus {
            outline: none;
            border-color: #4CAF50;
        }
        .pay-button {
            width: 100%;
            padding: 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 18px;
            cursor: pointer;
        }
        .pay-button:hover {
            background-color: #45a049;
        }
        .warning {
            background-color: #fff3cd;
            color: #856404;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            border-left: 4px solid #ffc107;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>💳 SecureShop Payment</h1>
    </div>
    <div class="container">
        <div class="warning">
            <strong>⚠️ SECURITY WARNING:</strong> This payment page is NOT secure! Using HTTP, not HTTPS. Your credit card information can be intercepted by attackers.
        </div>

        <div class="product-info">
            <h2>Order Summary</h2>
            <p><strong>Product:</strong> ${product}</p>
            <p><strong>Amount:</strong> <span class="price">$${amount.toFixed(2)}</span></p>
        </div>

        <form id="paymentForm">
            <div class="form-group">
                <label for="cardName">Cardholder Name:</label>
                <input type="text" id="cardName" required placeholder="John Doe">
            </div>

            <div class="form-group">
                <label for="cardNumber">Card Number:</label>
                <input type="text" id="cardNumber" required placeholder="1234 5678 9012 3456">
            </div>

            <div class="form-group">
                <label for="expiry">Expiry Date:</label>
                <input type="text" id="expiry" required placeholder="MM/YY">
            </div>

            <div class="form-group">
                <label for="cvv">CVV:</label>
                <input type="text" id="cvv" required placeholder="123">
            </div>

            <button type="submit" class="pay-button">Pay $${amount.toFixed(2)}</button>
        </form>

        <div style="margin-top: 30px;">
            <a href="/" style="color: #666;">← Back to Home</a>
        </div>
    </div>

    <script>
        document.getElementById('paymentForm').addEventListener('submit', function(e) {
            e.preventDefault();

            // Vulnerable: No server-side validation!
            const cardData = {
                cardName: document.getElementById('cardName').value,
                cardNumber: document.getElementById('cardNumber').value,
                expiry: document.getElementById('expiry').value,
                cvv: document.getElementById('cvv').value,
                amount: ${amount},
                product: '${product}'
            };

            // Vulnerable: Send data without encryption
            fetch('/api/payment/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cardData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Payment Processed Successfully!');
                window.location.href = '/transaction-success?reference=' + data.reference;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Payment failed!');
            });
        });

        console.log('⚠️ SECURITY VULNERABILITY: Sending credit card data over unencrypted HTTP!');
    </script>
</body>
</html>`;
    res.send(html);
});

// Process Payment API
app.post('/api/payment/process', (req, res) => {
    const cardData = req.body;

    // Vulnerable: Log sensitive data
    console.log('⚠️ TRANSACTION LOGGED:');
    console.log('Card Number:', cardData.cardNumber);
    console.log('Cardholder:', cardData.cardName);
    console.log('Amount:', cardData.amount);

    // Record transaction
    const transaction = {
        reference: 'TXN' + Date.now(),
        timestamp: new Date().toISOString(),
        product: cardData.product,
        amount: cardData.amount,
        cardNumber: cardData.cardNumber,
        status: 'success'
    };

    transactionLogs.push(transaction);

    // Send response
    res.json({
        success: true,
        reference: transaction.reference,
        message: 'Payment processed successfully'
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
        }
        .success-icon {
            font-size: 60px;
            color: #4CAF50;
            margin-bottom: 20px;
        }
        .success-box h1 {
            color: #4CAF50;
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
        }
    </style>
</head>
<body>
    <div class="success-box">
        <div class="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Your transaction has been processed successfully.</p>
        <p>Reference: ${req.query.reference}</p>
        <a href="/" class="btn">Return to Home</a>
    </div>
</body>
</html>`;
    res.send(html);
});

// Transaction Logs Page
app.get('/api/payment/logs', (req, res) => {
    res.json(transactionLogs);
});

// Serve payment logs page for demonstration
app.get('/transaction-logs', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Logs - View Attackers Can See This</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background-color: #ff4444;
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
        .warning {
            background-color: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #f5c6cb;
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
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Transaction Logs</h1>
        <p>⚠️ These logs are visible to anyone on the network!</p>
    </div>
    <div class="container">
        <div class="warning">
            <strong>⚠️ SECURITY VULNERABILITY:</strong> These transaction logs are sent over unencrypted HTTP. An attacker on the same network can intercept and read all these logs, including sensitive credit card information!
        </div>
        <h2>All Transactions</h2>
        <table id="logsTable">
            <thead>
                <tr>
                    <th>Reference</th>
                    <th>Timestamp</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Card Number (last 4)</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${transactionLogs.map(log => `
                    <tr>
                        <td>${log.reference}</td>
                        <td>${log.timestamp}</td>
                        <td>${log.product}</td>
                        <td>$${log.amount.toFixed(2)}</td>
                        <td>•••• ${log.cardNumber.slice(-4)}</td>
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

// Start server
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🌐 HTTP Server running on port ${PORT}`);
    console.log(`⚠️  SECURITY WARNING: HTTP is INSECURE!`);
    console.log(`⚠️  Use HTTPS (port 8443) for security`);
    console.log(`========================================`);
    console.log(`\nVulnerabilities Demonstrated:`);
    console.log(`1. Content Tampering - Modify prices easily`);
    console.log(`2. Payment Data Interception - Card info sent unencrypted`);
    console.log(`3. Transaction Logs Exposed - Visible to attackers`);
    console.log(`========================================`);
});
