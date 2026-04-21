const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureShop - HTTP Version (INSECURE)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: #ff4444; color: white; padding: 20px; text-align: center; }
        .container { max-width: 1000px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; }
        .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
        .product { border: 1px solid #ddd; padding: 15px; text-align: center; }
        .product img { width: 100%; height: 150px; object-fit: cover; border-radius: 4px; }
        .price { font-size: 24px; color: #4CAF50; font-weight: bold; }
        .btn { padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; }
        .warning { background: #f8d7da; color: #721c24; padding: 15px; margin: 20px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 SecureShop <span style="background: #ff4444; padding: 5px 15px; border-radius: 12px;">INSECURE</span></h1>
        <p>⚠️ WARNING: This is HTTP - Not Encrypted!</p>
    </div>
    <div class="container">
        <div class="warning">
            <strong>⚠️ SECURITY ALERT:</strong> You are on HTTP, not HTTPS! Your data can be intercepted by attackers!
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
    <title>Payment - HTTP (UNSECURED)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: #ff4444; color: white; padding: 20px; text-align: center; }
        .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; }
        .warning { background: #f8d7da; color: #721c24; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .pay-btn { width: 100%; padding: 15px; background: #ff4444; color: white; border: none; border-radius: 4px; font-size: 18px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💳 Payment - HTTP UNSECURED</h1>
    </div>
    <div class="container">
        <div class="warning">
            <strong>⚠️ CRITICAL WARNING:</strong> You are sending credit card data over UNENCRYPTED HTTP!
            <br>Anyone on the network can intercept and steal your card number!
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
                .then(r => r.json()).then(() => alert('Payment Processed (HTTP)!'));
        });
    </script>
</body>
</html>`);
});

app.post('/process', (req, res) => {
    console.log('Payment Processed:', req.body);
    res.json({ success: true, message: 'Payment received over HTTP' });
});

app.listen(PORT, () => console.log(`HTTP Server running on http://localhost:${PORT} - ⚠️ INSECURE!`));
