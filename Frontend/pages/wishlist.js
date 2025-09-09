// Wishlist Page JavaScript
class WishlistPage {
    constructor() {
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderWishlist();
        this.updateWishlistCount();
        this.setupMatchingFeature();
        this.animatePageLoad();
    }

    setupEventListeners() {
        // Back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.history.back();
            });
        }

        // Clear all wishlist
        const clearBtn = document.getElementById('clearWishlistBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearWishlist();
            });
        }
    }

    renderWishlist() {
        const wishlistGrid = document.getElementById('wishlistGrid');
        const emptyWishlist = document.getElementById('emptyWishlist');

        if (this.wishlist.length === 0) {
            wishlistGrid.style.display = 'none';
            emptyWishlist.style.display = 'block';
            return;
        }

        wishlistGrid.style.display = 'grid';
        emptyWishlist.style.display = 'none';
        wishlistGrid.innerHTML = '';

        this.wishlist.forEach((item, index) => {
            const wishlistItem = this.createWishlistItem(item, index);
            wishlistGrid.appendChild(wishlistItem);
        });
    }

    createWishlistItem(product, index) {
        const item = document.createElement('div');
        item.className = 'wishlist-item';
        item.style.animationDelay = `${index * 0.1}s`;
        
        const addedDate = new Date(product.dateAdded).toLocaleDateString();
        
        item.innerHTML = `
            <div class="wishlist-item-image">
                <span>${product.name}</span>
            </div>
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${product.name}</div>
                <div class="wishlist-item-price">$${product.price}</div>
                <div class="wishlist-item-added">Added on ${addedDate}</div>
                <div class="wishlist-item-actions">
                    <button class="move-to-cart-btn" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="remove-from-wishlist-btn" data-product-id="${product.id}" title="Remove from wishlist">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Add click handler for product navigation (except on buttons)
        item.addEventListener('click', (e) => {
            if (e.target.closest('.wishlist-item-actions')) return;
            window.location.href = `product.html?id=${product.id}`;
        });

        // Move to cart button
        const moveToCartBtn = item.querySelector('.move-to-cart-btn');
        moveToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.moveToCart(product);
        });

        // Remove from wishlist button
        const removeBtn = item.querySelector('.remove-from-wishlist-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeFromWishlist(product.id, item);
        });

        return item;
    }

    moveToCart(product) {
        // Add to cart
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            size: 'M', // Default size
            color: 'black', // Default color
            image: product.image
        };

        // Check if item already exists in cart
        const existingIndex = this.cart.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
            this.cart[existingIndex].quantity += 1;
        } else {
            this.cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartDisplay();
        this.showNotification('Added to cart!', 'success');

        // Animate button
        const btn = document.querySelector(`[data-product-id="${product.id}"].move-to-cart-btn`);
        if (btn) {
            btn.style.background = '#28a745';
            btn.textContent = '✓ Added';
            setTimeout(() => {
                btn.style.background = '';
                btn.textContent = 'Add to Cart';
            }, 2000);
        }
    }

    removeFromWishlist(productId, itemElement) {
        // Add removing animation
        itemElement.classList.add('removing');
        
        setTimeout(() => {
            // Remove from wishlist array
            this.wishlist = this.wishlist.filter(item => item.id !== productId);
            localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
            
            // Re-render wishlist
            this.renderWishlist();
            this.updateWishlistCount();
            this.showNotification('Removed from wishlist', 'info');
        }, 400);
    }

    clearWishlist() {
        if (this.wishlist.length === 0) return;

        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            // Add fade out animation to grid
            const wishlistGrid = document.getElementById('wishlistGrid');
            wishlistGrid.classList.add('updating');
            
            setTimeout(() => {
                this.wishlist = [];
                localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
                this.renderWishlist();
                this.updateWishlistCount();
                this.showNotification('Wishlist cleared', 'info');
            }, 300);
        }
    }

    updateWishlistCount() {
        const countElement = document.getElementById('wishlistCount');
        if (countElement) {
            const count = this.wishlist.length;
            countElement.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
        }

        // Update header badge
        this.updateWishlistBadge();
    }

    updateWishlistBadge() {
        const wishlistIcon = document.querySelector('.nav__icon[title="Wishlist"]');
        if (!wishlistIcon) return;

        let badge = wishlistIcon.querySelector('.wishlist-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'wishlist-badge';
            wishlistIcon.appendChild(badge);
        }

        const count = this.wishlist.length;
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }

    updateCartDisplay() {
        const cartTotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const cartPriceElement = document.querySelector('.cart-price');
        if (cartPriceElement) {
            cartPriceElement.textContent = `$${cartTotal}`;
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--accent-gold)' : '#4a90e2'};
            color: var(--primary-dark);
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease forwards;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    setupMatchingFeature() {
        const matchingBtn = document.getElementById('matchingBtn');
        if (matchingBtn) {
            matchingBtn.addEventListener('click', () => {
                console.log('Matching feature clicked from wishlist page');
                // You can implement the same matching overlay here if needed
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
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new WishlistPage();
});
