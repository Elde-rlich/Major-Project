// Account Page JavaScript
class AccountPage {
    constructor() {
        this.isNotifyActive = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleImageError();
        this.setupMatchingFeature();
        this.animatePageLoad();
        this.updateCartDisplay();
    }

    setupEventListeners() {
        // Back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.history.back();
            });
        }

        // Notify button
        const notifyBtn = document.getElementById('notifyBtn');
        if (notifyBtn) {
            notifyBtn.addEventListener('click', () => {
                this.handleNotifyClick();
            });
        }

        // Handle escape key to go back
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.location.href = '../homepage/index.html';
            }
        });
    }

    handleImageError() {
        const maintenanceImg = document.querySelector('.maintenance-img');
        const fallbackIcon = document.querySelector('.maintenance-icon-fallback');
        
        if (maintenanceImg && fallbackIcon) {
            maintenanceImg.addEventListener('error', () => {
                maintenanceImg.style.display = 'none';
                fallbackIcon.style.display = 'block';
                console.log('Maintenance image not found, showing fallback icon');
            });

            // Also check if image loads successfully
            maintenanceImg.addEventListener('load', () => {
                fallbackIcon.style.display = 'none';
                console.log('Maintenance image loaded successfully');
            });
        }
    }

    handleNotifyClick() {
        const notifyBtn = document.getElementById('notifyBtn');
        
        if (this.isNotifyActive) {
            // Already notified
            this.showNotification('You\'re already on our notification list!', 'info');
            return;
        }

        // Show loading state
        notifyBtn.classList.add('loading');
        notifyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Processing...
        `;

        // Simulate API call
        setTimeout(() => {
            notifyBtn.classList.remove('loading');
            notifyBtn.classList.add('active');
            notifyBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"/>
                </svg>
                Notification Set
            `;
            
            this.isNotifyActive = true;
            this.showNotification('We\'ll notify you when the account section is ready!', 'success');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                if (notifyBtn.classList.contains('active')) {
                    notifyBtn.classList.remove('active');
                    notifyBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                        Notify Me
                    `;
                }
            }, 3000);
        }, 2000);
    }

    updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
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
            animation: slideInDown 0.3s ease forwards;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s ease forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    setupMatchingFeature() {
        const matchingBtn = document.getElementById('matchingBtn');
        if (matchingBtn) {
            matchingBtn.addEventListener('click', () => {
                console.log('Matching feature clicked from account page');
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

        // Add staggered animation to maintenance content children
        const maintenanceElements = document.querySelectorAll('.maintenance-content > *');
        maintenanceElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 500 + (index * 150));
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AccountPage();
});
