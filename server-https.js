const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const PORT = 8443;

app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    if (req.protocol === 'http') {
        return res.redirect(`https://${req.get('host')}${req.url}`);
    }
    next();
});

app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';");
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
                <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=150&fit=crop" alt="Laptop" onerror="this.src='https://placehold.co/300x150/4CAF50/FFFFFF?text=Laptop'">
                <h3>High-Performance Laptop</h3>
                <p class="price">₹82,000</p>
                <button class="btn" onclick="buy('Laptop', 82000)">Buy Now</button>
            </div>
            <div class="product">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=150&fit=crop" alt="Headphones" onerror="this.src='https://placehold.co/300x150/2196F3/FFFFFF?text=Headphones'">
                <h3>Premium Headphones</h3>
                <p class="price">₹12,500</p>
                <button class="btn" onclick="buy('Headphones', 12500)">Buy Now</button>
            </div>
        </div>
    </div>
    <script>
        function buy(product, price) {
            window.location.href = '/payment?product=' + product + '&price=' + price;
        }
    </script>
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
    <script>
        document.getElementById('payForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                product: '${product}',
                price: ${price},
                card: document.getElementById('card').value,
                expiry: document.getElementById('expiry').value,
                cvv: document.getElementById('cvv').value
            };
            fetch('/process', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
                .then(r => r.json()).then(() => alert('Payment Processed Securely (HTTPS)!'));
        });
    </script>
</body>
</html>`);
});

app.post('/process', (req, res) => {
    console.log('Secure Payment:', req.body);
    res.json({ success: true, message: 'Payment received over HTTPS' });
});

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(PORT, () => console.log(`HTTPS Server running on https://localhost:${PORT} - ✅ SECURE!`));
