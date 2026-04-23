/**
 * Landing Page JavaScript
 * Handles product selection and navigation to payment page
 */

// Helper function to set up image error handlers
function setupImageErrorHandlers() {
    const images = document.querySelectorAll('.product img');
    images.forEach(img => {
        // Store original src
        const originalSrc = img.src;

        img.addEventListener('error', function() {
            // If image fails to load, use placeholder
            const altText = img.alt || 'Product';
            const colors = {
                'Laptop': '4CAF50',
                'Headphones': '2196F3',
                'Smartphone': 'FF9800',
                'Smart Watch': '9C27B0',
                'default': '4CAF50'
            };
            const color = colors[altText] || colors.default;
            this.src = `https://placehold.co/300x150/${color}/FFFFFF?text=${encodeURIComponent(altText)}`;
        });

        // Optional: try to reload once if failed
        img.addEventListener('load', function() {
            // Image loaded successfully
            console.log('Image loaded:', originalSrc);
        });
    });
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up image error handlers
    setupImageErrorHandlers();

    // Find all buy buttons and add click handlers
    const buyButtons = document.querySelectorAll('.btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const product = this.getAttribute('data-product');
            const price = this.getAttribute('data-price');
            window.location.href = '/payment?product=' + product + '&price=' + price;
        });
    });
});
