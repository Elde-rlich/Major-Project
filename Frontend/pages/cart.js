// Cart Page JavaScript
class CartPage {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.promoCodes = {
            'WELCOME10': { discount: 0.1, description: '10% off your order' },
            'SAVE20': { discount: 0.2, description: '20% off your order' },
            'FREESHIP': { discount: 0, freeShipping: true, description: 'Free shipping' }
        };
        this.appliedPromo = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCart();
        this.updateCartSummary();
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

        // Clear cart
        const clearBtn = document.getElementById('clearCartBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }

        // Promo code
        const applyPromoBtn = document.getElementById('applyPromoBtn');
        const promoInput = document.getElementById('promoInput');
        
        if (applyPromoBtn && promoInput) {
            applyPromoBtn.addEventListener('click', () => {
                this.applyPromoCode();
            });
            
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyPromoCode();
                }
            });
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartMain = document.getElementById('cartMain');

        if (this.cart.length === 0) {
            cartMain.style.display = 'none';
            emptyCart.style.display = 'block';
            this.updateCartCount();
            return;
        }

        cartMain.style.display = 'grid';
        emptyCart.style.display = 'none';
        cartItems.innerHTML = '';

        this.cart.forEach((item, index) => {
            const cartItem = this.createCartItem(item, index);
            cartItems.appendChild(cartItem);
        });

        this.updateCartCount();
    }

    createCartItem(item, index) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.style.animationDelay = `${index * 0.1}s`;
        
        cartItem.innerHTML = `
            <div class="cart-item-image" onclick="window.location.href='product.html?id=${item.id}'">
                <span>${item.name}</span>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-info">
                    <h3 onclick="window.location.href='product.html?id=${item.id}'">${item.name}</h3>
                    <div class="cart-item-specs">
                        <span class="cart-item-spec">Size: ${item.size || 'M'}</span>
                        <span class="cart-item-spec">Color: ${item.color || 'Black'}</span>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-btn" data-item-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-item-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item-btn" data-item-id="${item.id}" title="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const decreaseBtn = cartItem.querySelector('.decrease-btn');
        const increaseBtn = cartItem.querySelector('.increase-btn');
        const removeBtn = cartItem.querySelector('.remove-item-btn');

        decreaseBtn.addEventListener('click', () => {
            this.updateQuantity(item.id, item.quantity - 1);
        });

        increaseBtn.addEventListener('click', () => {
            this.updateQuantity(item.id, item.quantity + 1);
        });

        removeBtn.addEventListener('click', () => {
            this.removeFromCart(item.id, cartItem);
        });

        return cartItem;
    }

    updateQuantity(itemId, newQuantity) {
        if (newQuantity < 1) {
            return;
        }

        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            this.cart[itemIndex].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(this.cart));
            
            // Update the display
            const quantityDisplay = document.querySelector(`[data-item-id="${itemId}"]`).closest('.quantity-control').querySelector('.quantity-display');
            const priceDisplay = document.querySelector(`[data-item-id="${itemId}"]`).closest('.cart-item').querySelector('.cart-item-price');
            
            quantityDisplay.textContent = newQuantity;
            priceDisplay.textContent = `$${(this.cart[itemIndex].price * newQuantity).toFixed(2)}`;
            
            // Update disable state for decrease button
            const decreaseBtn = document.querySelector(`[data-item-id="${itemId}"].decrease-btn`);
            decreaseBtn.disabled = newQuantity <= 1;
            
            this.updateCartSummary();
            this.updateCartCount();
            this.updateHeaderCartDisplay();
        }
    }

    removeFromCart(itemId, cartItemElement) {
        cartItemElement.classList.add('removing');
        
        setTimeout(() => {
            this.cart = this.cart.filter(item => item.id !== itemId);
            localStorage.setItem('cart', JSON.stringify(this.cart));
            
            this.renderCart();
            this.updateCartSummary();
            this.updateHeaderCartDisplay();
            this.showNotification('Item removed from cart', 'info');
        }, 400);
    }

    clearCart() {
        if (this.cart.length === 0) return;

        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            localStorage.setItem('cart', JSON.stringify(this.cart));
            
            this.renderCart();
            this.updateCartSummary();
            this.updateHeaderCartDisplay();
            this.showNotification('Cart cleared', 'info');
        }
    }

    updateCartCount() {
        const countElement = document.getElementById('cartCount');
        if (countElement) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            countElement.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
        }
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = this.appliedPromo?.freeShipping || subtotal > 100 ? 0 : 10;
        const discount = this.appliedPromo ? subtotal * this.appliedPromo.discount : 0;
        const tax = (subtotal - discount) * 0.08; // 8% tax
        const total = subtotal - discount + shipping + tax;

        document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shippingAmount').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;

        // Show discount if applied
        const existingDiscount = document.querySelector('.summary-row.discount');
        if (this.appliedPromo && discount > 0) {
            if (!existingDiscount) {
                const discountRow = document.createElement('div');
                discountRow.className = 'summary-row discount';
                discountRow.innerHTML = `
                    <span>Discount (${this.appliedPromo.description})</span>
                    <span style="color: #28a745;">-$${discount.toFixed(2)}</span>
                `;
                document.querySelector('.summary-divider').before(discountRow);
            } else {
                existingDiscount.innerHTML = `
                    <span>Discount (${this.appliedPromo.description})</span>
                    <span style="color: #28a745;">-$${discount.toFixed(2)}</span>
                `;
            }
        } else if (existingDiscount) {
            existingDiscount.remove();
        }
    }

    applyPromoCode() {
        const promoInput = document.getElementById('promoInput');
        const promoMessage = document.getElementById('promoMessage');
        const code = promoInput.value.trim().toUpperCase();

        if (!code) {
            this.showPromoMessage('Please enter a promo code', 'error');
            return;
        }

        if (this.promoCodes[code]) {
            this.appliedPromo = this.promoCodes[code];
            this.updateCartSummary();
            this.showPromoMessage(`✓ ${this.appliedPromo.description} applied!`, 'success');
            promoInput.value = '';
        } else {
            this.showPromoMessage('Invalid promo code', 'error');
        }
    }

    showPromoMessage(message, type) {
        const promoMessage = document.getElementById('promoMessage');
        promoMessage.textContent = message;
        promoMessage.className = `promo-message ${type} show`;
        
        setTimeout(() => {
            promoMessage.classList.remove('show');
        }, 3000);
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        // Animate checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.style.background = '#28a745';
        checkoutBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"/>
            </svg>
            Processing...
        `;

        setTimeout(() => {
            this.showNotification('Redirecting to checkout...', 'success');
            // Here you would redirect to actual checkout page
            console.log('Checkout with items:', this.cart);
        }, 2000);
    }

    updateHeaderCartDisplay() {
        const cartTotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const cartPriceElement = document.querySelector('.cart-price');
        if (cartPriceElement) {
            cartPriceElement.textContent = `$${cartTotal.toFixed(2)}`;
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--accent-gold)' : type === 'error' ? '#dc3545' : '#4a90e2'};
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

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    setupMatchingFeature() {
        const matchingBtn = document.getElementById('matchingBtn');
        if (matchingBtn) {
            matchingBtn.addEventListener('click', () => {
                console.log('Matching feature clicked from cart page');
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
    new CartPage();
});
