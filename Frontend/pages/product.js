// Product Detail Page JavaScript
class ProductDetailPage {
    constructor() {
        this.currentProduct = null;
        this.currentImageIndex = 0;
        this.quantity = 1;
        this.selectedSize = 'S';
        this.selectedColor = 'black';
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        this.init();
    }

    init() {
        this.loadProductFromURL();
        this.setupEventListeners();
        this.setupMatchingFeature();
        this.loadRelatedProducts();
    }

    loadProductFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (productId) {
            this.currentProduct = this.getProductById(parseInt(productId));
            if (this.currentProduct) {
                this.renderProduct();
            } else {
                this.redirectToHome();
            }
        } else {
            this.redirectToHome();
        }
    }

    getProductById(id) {
        const allProducts = [
            {id: 1, name: 'Classic Blazer', price: 299, category: 'blazers', gender: 'men', image: 'product1.jpg'},
            {id: 2, name: 'Elegant Dress', price: 199, category: 'dresses', gender: 'women', image: 'product2.jpg'},
            {id: 3, name: 'Cotton T-Shirt', price: 49, category: 't-shirts', gender: 'men', image: 'product3.jpg'},
            {id: 4, name: 'Denim Jeans', price: 129, category: 'jeans', gender: 'women', image: 'product4.jpg'},
            {id: 5, name: 'Wool Sweater', price: 179, category: 'sweaters', gender: 'men', image: 'product5.jpg'},
            {id: 6, name: 'Silk Blouse', price: 159, category: 'tops', gender: 'women', image: 'product6.jpg'},
            {id: 7, name: 'Casual Shirt', price: 89, category: 'casual shirts', gender: 'men', image: 'product7.jpg'},
            {id: 8, name: 'Mini Skirt', price: 79, category: 'skirts', gender: 'women', image: 'product8.jpg'},
            {id: 9, name: 'Formal Trousers', price: 149, category: 'formal trousers', gender: 'men', image: 'product9.jpg'},
            {id: 10, name: 'Leather Jacket', price: 249, category: 'jackets', gender: 'women', image: 'product10.jpg'}
        ];
        
        return allProducts.find(product => product.id === id);
    }

    renderProduct() {
        if (!this.currentProduct) return;

        // Update page title
        document.title = `${this.currentProduct.name} - TRUE CLASSICS`;

        // Update breadcrumb
        document.getElementById('productCategory').textContent = this.formatCategory(this.currentProduct.category);
        document.getElementById('productName').textContent = this.currentProduct.name;

        // Update product info
        document.getElementById('productTitle').textContent = this.currentProduct.name;
        document.getElementById('productPrice').textContent = `$${this.currentProduct.price}`;
        document.getElementById('mainImageText').textContent = this.currentProduct.name.toUpperCase();

        // Generate thumbnails
        this.generateThumbnails();

        // Add entrance animations
        this.animatePageLoad();
    }

    formatCategory(category) {
        return category.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    generateThumbnails() {
        const thumbnailContainer = document.getElementById('productThumbnails');
        thumbnailContainer.innerHTML = '';

        // Generate 4 thumbnails for demo
        for (let i = 0; i < 4; i++) {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${i === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `${i + 1}`;
            thumbnail.addEventListener('click', () => this.switchImage(i));
            thumbnailContainer.appendChild(thumbnail);
        }
    }

    switchImage(index) {
        this.currentImageIndex = index;
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Add image transition effect
        const mainImage = document.getElementById('mainImageContainer');
        mainImage.style.opacity = '0.7';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 150);
    }

    setupEventListeners() {
        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            window.history.back();
        });

        // Image navigation
        document.getElementById('prevImageBtn').addEventListener('click', () => {
            const newIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : 3;
            this.switchImage(newIndex);
        });

        document.getElementById('nextImageBtn').addEventListener('click', () => {
            const newIndex = this.currentImageIndex < 3 ? this.currentImageIndex + 1 : 0;
            this.switchImage(newIndex);
        });

        // Size selection
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedSize = btn.textContent;
            });
        });

        // Color selection
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedColor = btn.dataset.color;
            });
        });

        // Quantity controls
        document.getElementById('decreaseQty').addEventListener('click', () => {
            if (this.quantity > 1) {
                this.quantity--;
                document.getElementById('quantityDisplay').textContent = this.quantity;
            }
        });

        document.getElementById('increaseQty').addEventListener('click', () => {
            this.quantity++;
            document.getElementById('quantityDisplay').textContent = this.quantity;
        });

        // Add to cart
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            this.addToCart();
        });

        // Wishlist
        document.getElementById('wishlistBtn').addEventListener('click', (e) => {
            e.currentTarget.classList.toggle('active');
            this.showNotification('Added to wishlist!');
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                document.getElementById('prevImageBtn').click();
            } else if (e.key === 'ArrowRight') {
                document.getElementById('nextImageBtn').click();
            }
        });
    }

    addToCart() {
        const cartItem = {
            id: this.currentProduct.id,
            name: this.currentProduct.name,
            price: this.currentProduct.price,
            size: this.selectedSize,
            color: this.selectedColor,
            quantity: this.quantity,
            image: this.currentProduct.image
        };

        // Find existing item
        const existingIndex = this.cart.findIndex(item => 
            item.id === cartItem.id && 
            item.size === cartItem.size && 
            item.color === cartItem.color
        );

        if (existingIndex !== -1) {
            this.cart[existingIndex].quantity += cartItem.quantity;
        } else {
            this.cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
        this.showNotification('Added to cart!');
        this.animateAddToCart();
    }

    updateCartDisplay() {
        const cartTotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const cartPriceElement = document.querySelector('.cart-price');
        if (cartPriceElement) {
            cartPriceElement.textContent = `$${cartTotal}`;
        }
    }

    animateAddToCart() {
        const btn = document.getElementById('addToCartBtn');
        btn.style.transform = 'scale(0.95)';
        btn.style.background = '#28a745';
        btn.innerHTML = '✓ Added to Cart';
        
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            btn.style.background = '';
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="m1 1 4 4 1 2h14l-1 4H6"/>
                </svg>
                Add to Cart
            `;
        }, 2000);
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-gold);
            color: var(--primary-dark);
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    loadRelatedProducts() {
        const relatedGrid = document.getElementById('relatedProductsGrid');
        const allProducts = [
            {id: 1, name: 'Classic Blazer', price: 299, category: 'blazers', gender: 'men'},
            {id: 2, name: 'Elegant Dress', price: 199, category: 'dresses', gender: 'women'},
            {id: 3, name: 'Cotton T-Shirt', price: 49, category: 't-shirts', gender: 'men'},
            {id: 4, name: 'Denim Jeans', price: 129, category: 'jeans', gender: 'women'}
        ];

        // Filter out current product and get 4 related products
        const relatedProducts = allProducts
            .filter(product => product.id !== this.currentProduct?.id)
            .slice(0, 4);

        relatedGrid.innerHTML = '';
        relatedProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            relatedGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <span>${product.name}</span>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="window.location.href='product.html?id=${product.id}'">
                    View Details
                </button>
            </div>
        `;
        return card;
    }

    setupMatchingFeature() {
        // Same matching functionality as main page
        const matchingBtn = document.getElementById('matchingBtn');
        if (matchingBtn) {
            matchingBtn.addEventListener('click', () => {
                // Implement matching overlay (same as main page)
                console.log('Matching feature clicked');
            });
        }
    }

    animatePageLoad() {
        const elements = document.querySelectorAll('.fade-in-section');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    redirectToHome() {
        window.location.href = 'index.html';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ProductDetailPage();
});
