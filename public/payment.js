/**
 * Payment Page JavaScript
 * Handles payment form submission
 */

// Helper function to get URL query parameters
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Helper function to parse price as number
function parsePrice(priceStr) {
    // Remove currency symbols and commas
    const clean = priceStr.replace(/[^0-9.-]+/g, '');
    return parseInt(clean, 10) || 0;
}

document.addEventListener('DOMContentLoaded', function() {
    const payForm = document.getElementById('payForm');

    if (payForm) {
        payForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get product and price from URL query parameters
            const productParam = getQueryParam('product') || 'Product';
            const priceParam = getQueryParam('price') || '0';
            const price = parsePrice(priceParam);

            // Get form data
            const data = {
                product: productParam,
                price: price,
                card: document.getElementById('card').value,
                expiry: document.getElementById('expiry').value,
                cvv: document.getElementById('cvv').value
            };

            // Send payment data to server
            fetch('/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    alert('✓ Payment Processed Securely (HTTPS)! \n\nReference: ' + response.reference);
                    window.location.href = '/transaction-success?reference=' + response.reference;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Payment failed! Please try again.');
            });
        });
    }
});
