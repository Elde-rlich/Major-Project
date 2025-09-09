// Fashion Website JavaScript - Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

// Application state
const appState = {
    currentPage: 1,
    itemsPerPage: 20,
    currentGender: 'all',
    currentCategory: 'all',
    cart: [],
    cartTotal: 0
};

// Product categories data
const categories = {
    men: ['sweatshirts', 'sweaters', 'shorts', 'kurtas', 'jeans', 'jackets', 'formal trousers', 'formal shirts', 'blazers', 'casual shirts', 'casual trousers', 't-shirts'],
    women: ['blazers', 'coats', 'dresses', 'jackets', 'jeans', 'playsuit', 'shorts', 'shrugs', 'skirts', 'sweaters', 'sweatshirts', 'tops', 'trousers', 't-shirts', 'waistcoat']
};

// Extended sample products for demonstration
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
    {id: 10, name: 'Leather Jacket', price: 249, category: 'jackets', gender: 'women', image: 'product10.jpg'},
    // Additional products for pagination demonstration
    {id: 11, name: 'Premium Sweatshirt', price: 119, category: 'sweatshirts', gender: 'men', image: 'product11.jpg'},
    {id: 12, name: 'Designer Coat', price: 399, category: 'coats', gender: 'women', image: 'product12.jpg'},
    {id: 13, name: 'Summer Shorts', price: 69, category: 'shorts', gender: 'men', image: 'product13.jpg'},
    {id: 14, name: 'Chic Playsuit', price: 139, category: 'playsuit', gender: 'women', image: 'product14.jpg'},
    {id: 15, name: 'Traditional Kurta', price: 89, category: 'kurtas', gender: 'men', image: 'product15.jpg'},
    {id: 16, name: 'Stylish Shrug', price: 79, category: 'shrugs', gender: 'women', image: 'product16.jpg'},
    {id: 17, name: 'Formal Shirt', price: 99, category: 'formal shirts', gender: 'men', image: 'product17.jpg'},
    {id: 18, name: 'Elegant Trousers', price: 129, category: 'trousers', gender: 'women', image: 'product18.jpg'},
    {id: 19, name: 'Casual T-Shirt', price: 39, category: 't-shirts', gender: 'women', image: 'product19.jpg'},
    {id: 20, name: 'Designer Waistcoat', price: 189, category: 'waistcoat', gender: 'women', image: 'product20.jpg'},
    {id: 21, name: 'Sports Jacket', price: 199, category: 'jackets', gender: 'men', image: 'product21.jpg'},
    {id: 22, name: 'Comfy Sweatshirt', price: 109, category: 'sweatshirts', gender: 'women', image: 'product22.jpg'},
    {id: 23, name: 'Casual Trousers', price: 99, category: 'casual trousers', gender: 'men', image: 'product23.jpg'},
    {id: 24, name: 'Summer Top', price: 59, category: 'tops', gender: 'women', image: 'product24.jpg'},
    {id: 25, name: 'Winter Sweater', price: 159, category: 'sweaters', gender: 'women', image: 'product25.jpg'},
    {id: 26, name: 'Classic Jeans', price: 109, category: 'jeans', gender: 'men', image: 'product26.jpg'},
    {id: 27, name: 'Trendy Shorts', price: 59, category: 'shorts', gender: 'women', image: 'product27.jpg'},
    {id: 28, name: 'Business Blazer', price: 329, category: 'blazers', gender: 'women', image: 'product28.jpg'},
    {id: 29, name: 'Polo Shirt', price: 79, category: 'casual shirts', gender: 'men', image: 'product29.jpg'},
    {id: 30, name: 'Evening Dress', price: 249, category: 'dresses', gender: 'women', image: 'product30.jpg'},
    {id: 31, name: 'Denim Jacket', price: 149, category: 'jackets', gender: 'men', image: 'product31.jpg'},
    {id: 32, name: 'Floral Top', price: 69, category: 'tops', gender: 'women', image: 'product32.jpg'},
    {id: 33, name: 'Chino Trousers', price: 99, category: 'casual trousers', gender: 'men', image: 'product33.jpg'},
    {id: 34, name: 'Midi Skirt', price: 89, category: 'skirts', gender: 'women', image: 'product34.jpg'},
    {id: 35, name: 'Henley Shirt', price: 59, category: 'casual shirts', gender: 'men', image: 'product35.jpg'}
];

// Initialize application
function initializeApp() {
    console.log('Initializing TRUE CLASSICS Fashion Website...');
    
    // Wait for DOM to be fully loaded
    setTimeout(() => {
        setupNavigation();
        setupAnimations();
        setupFilters();
        populateCategorySelect();
        setupProductInteractions();
        loadRecommendedProducts();
        loadProducts();
        updateCartDisplay();
        
        console.log('TRUE CLASSICS Fashion Website Initialized Successfully');
    }, 100);
}

// Navigation setup
// Navigation setup function - UPDATED
function setupNavigation() {
    console.log('Setting up navigation...');
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Shop Now button functionality - FIXED
    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Shop Now button clicked');
            scrollToSection('products');
        });
    } else {
        console.warn('Shop Now button not found');
    }

    // NEW ACCOUNT BUTTON FUNCTIONALITY
    const accountBtn = document.getElementById('accountBtn');
    if (accountBtn) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Account button clicked');
            // Navigate to account page (create this page later)
            window.location.href = '../pages/accounts.html';
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', debounce(() => {
        const header = document.querySelector('.header');
        const currentScrollY = window.scrollY;
        if (currentScrollY > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
        }
        updateActiveNavigationOnScroll();
    }, 10));
}


// Improved scroll to section function
function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
        
        updateActiveNavigation(sectionId);
        console.log(`Scrolled to section: ${sectionId}`);
    } else {
        console.warn(`Section not found: ${sectionId}`);
    }
}

// Update active navigation on scroll
function updateActiveNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            updateActiveNavigation(sectionId);
        }
    });
}

// Update active navigation
function updateActiveNavigation(targetId) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${targetId}`) {
            link.classList.add('active');
        }
    });
}

// Setup animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-section');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Setup filter controls - FIXED
function setupFilters() {
    console.log('Setting up filters...');
    
    // Gender filter buttons - FIXED
    const genderBtns = document.querySelectorAll('.gender-btn');
    genderBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Gender filter clicked:', this.dataset.gender);
            
            // Update active state
            genderBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update app state
            appState.currentGender = this.dataset.gender;
            appState.currentPage = 1;
            
            console.log('Updated gender filter to:', appState.currentGender);
            
            // Update category options
            updateCategoryOptions();
            
            // Reload products
            loadProducts();
        });
    });

    // Category filter select - FIXED
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        categorySelect.addEventListener('change', function(e) {
            console.log('Category filter changed:', this.value);
            appState.currentCategory = this.value;
            appState.currentPage = 1;
            loadProducts();
        });
    }
}

// Populate category select options - FIXED
function populateCategorySelect() {
    console.log('Populating category select...');
    updateCategoryOptions();
}

// Update category options based on selected gender - FIXED
function updateCategoryOptions() {
    const categorySelect = document.getElementById('categorySelect');
    if (!categorySelect) return;
    
    // Clear existing options except "All Categories"
    categorySelect.innerHTML = '<option value="all">All Categories</option>';
    
    let categoriesToShow = [];
    
    if (appState.currentGender === 'men') {
        categoriesToShow = categories.men;
    } else if (appState.currentGender === 'women') {
        categoriesToShow = categories.women;
    } else {
        // All categories
        categoriesToShow = [...new Set([...categories.men, ...categories.women])];
    }
    
    categoriesToShow.sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        categorySelect.appendChild(option);
    });
    
    // Reset category selection when gender changes
    if (appState.currentCategory !== 'all' && !categoriesToShow.includes(appState.currentCategory)) {
        appState.currentCategory = 'all';
        categorySelect.value = 'all';
    }
}

// Load recommended products
function loadRecommendedProducts() {
    const recommendedGrid = document.getElementById('recommendedGrid');
    if (!recommendedGrid) return;
    
    // Show first 4 products as recommended
    const recommendedProducts = allProducts.slice(0, 4);
    
    recommendedGrid.innerHTML = '';
    recommendedProducts.forEach(product => {
        const productCard = createProductCard(product);
        recommendedGrid.appendChild(productCard);
    });
    
    console.log('Loaded recommended products:', recommendedProducts.length);
}

// Filter products based on current state - FIXED
function getFilteredProducts() {
    let filtered = [...allProducts]; // Create a copy
    
    console.log('Filtering products - Gender:', appState.currentGender, 'Category:', appState.currentCategory);
    
    // Filter by gender
    if (appState.currentGender !== 'all') {
        filtered = filtered.filter(product => product.gender === appState.currentGender);
        console.log('After gender filter:', filtered.length, 'products');
    }
    
    // Filter by category
    if (appState.currentCategory !== 'all') {
        filtered = filtered.filter(product => product.category === appState.currentCategory);
        console.log('After category filter:', filtered.length, 'products');
    }
    
    return filtered;
}

// Load products with pagination - FIXED
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    console.log('Loading products for page:', appState.currentPage);
    
    // Show loading
    productsGrid.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    setTimeout(() => {
        const filteredProducts = getFilteredProducts();
        const totalPages = Math.ceil(filteredProducts.length / appState.itemsPerPage);
        const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
        const endIndex = startIndex + appState.itemsPerPage;
        const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
        
        console.log(`Showing products ${startIndex + 1}-${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length}`);
        
        productsGrid.innerHTML = '';
        
        if (currentPageProducts.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.7);">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters to see more products.</p>
                </div>
            `;
        } else {
            currentPageProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        }
        
        updatePagination(totalPages, filteredProducts.length);
    }, 300);
}

// Create product card function - COMPLETE UPDATED VERSION
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <div class="product-image">
            <span>${product.name}</span>
        </div>
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price}</div>
            <div class="product-actions" style="display: flex; gap: 8px; margin-top: 16px;">
                <button class="add-to-cart" data-product-id="${product.id}" style="flex: 1; background: transparent; color: var(--primary-light); border: 1px solid var(--border-color); padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.05em;">
                    Add to Cart
                </button>
                <button class="wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist" style="width: 40px; height: 40px; background: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // Add click handler for product navigation (except on buttons)
    productCard.addEventListener('click', function(e) {
        // Don't navigate if clicking action buttons
        if (e.target.closest('.product-actions')) {
            return;
        }
        // Navigate to product page
        window.location.href = `../pages/product.html?id=${product.id}`;
    });

    // Add to cart button functionality
    const addToCartBtn = productCard.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent card click navigation
        
        // Add to cart logic
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            size: 'M', // Default size
            color: 'black', // Default color
            image: product.image || 'placeholder.jpg'
        };

        // Get existing cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if item already exists
        const existingIndex = cart.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart display
        updateCartDisplay();
        
        // Show notification
        showNotification('Added to cart!', 'success');
        
        // Button animation
        this.style.background = 'var(--accent-gold)';
        this.style.color = 'var(--primary-dark)';
        this.textContent = '✓ Added';
        
        setTimeout(() => {
            this.style.background = 'transparent';
            this.style.color = 'var(--primary-light)';
            this.textContent = 'Add to Cart';
        }, 2000);
    });

    // Wishlist button functionality
    const wishlistBtn = productCard.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent card click navigation
        
        // Get existing wishlist
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Check if already in wishlist
        const existingIndex = wishlist.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
            showNotification('Already in wishlist!', 'info');
            return;
        }
        
        // Add to wishlist with timestamp
        const wishlistItem = {
            ...product,
            dateAdded: new Date().toISOString()
        };
        
        wishlist.push(wishlistItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update wishlist badge
        updateWishlistBadge();
        
        // Show notification
        showNotification('Added to wishlist!', 'success');
        
        // Button animation
        this.style.color = 'var(--accent-gold)';
        this.style.borderColor = 'var(--accent-gold)';
        this.style.background = 'rgba(212, 175, 55, 0.1)';
        
        setTimeout(() => {
            this.style.color = 'var(--text-muted)';
            this.style.borderColor = 'var(--border-color)';
            this.style.background = 'transparent';
        }, 2000);
    });

    // Add hover effects via JavaScript for better control
    const addToCartHover = productCard.querySelector('.add-to-cart');
    addToCartHover.addEventListener('mouseenter', function() {
        this.style.background = 'var(--accent-gold)';
        this.style.color = 'var(--primary-dark)';
        this.style.borderColor = 'var(--accent-gold)';
    });
    
    addToCartHover.addEventListener('mouseleave', function() {
        if (this.textContent === 'Add to Cart') {
            this.style.background = 'transparent';
            this.style.color = 'var(--primary-light)';
            this.style.borderColor = 'var(--border-color)';
        }
    });

    const wishlistHover = productCard.querySelector('.wishlist-btn');
    wishlistHover.addEventListener('mouseenter', function() {
        this.style.color = 'var(--accent-gold)';
        this.style.borderColor = 'var(--accent-gold)';
        this.style.background = 'rgba(212, 175, 55, 0.1)';
    });
    
    wishlistHover.addEventListener('mouseleave', function() {
        this.style.color = 'var(--text-muted)';
        this.style.borderColor = 'var(--border-color)';
        this.style.background = 'transparent';
    });

    return productCard;
}


// Update pagination controls - FIXED
function updatePagination(totalPages, totalProducts) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    console.log('Updating pagination - Total pages:', totalPages, 'Current page:', appState.currentPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="page-btn" ${appState.currentPage === 1 ? 'disabled' : ''} data-page="prev">
            ‹
        </button>
    `;
    
    // Page numbers - show more pages for better navigation
    const maxVisiblePages = 5;
    let startPage, endPage;
    
    if (totalPages <= maxVisiblePages) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (appState.currentPage <= 3) {
            startPage = 1;
            endPage = maxVisiblePages;
        } else if (appState.currentPage + 2 >= totalPages) {
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages;
        } else {
            startPage = appState.currentPage - 2;
            endPage = appState.currentPage + 2;
        }
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
        paginationHTML += `<button class="page-btn" data-page="1">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-btn ${i === appState.currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button class="page-btn" ${appState.currentPage === totalPages ? 'disabled' : ''} data-page="next">
            ›
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
    
    // Add click events to pagination buttons - FIXED
    const pageButtons = pagination.querySelectorAll('.page-btn');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.disabled) return;
            
            const pageData = this.dataset.page;
            let newPage;
            
            if (pageData === 'prev') {
                newPage = Math.max(1, appState.currentPage - 1);
            } else if (pageData === 'next') {
                newPage = appState.currentPage + 1;
            } else {
                newPage = parseInt(pageData);
            }
            
            if (newPage && newPage !== appState.currentPage && newPage >= 1) {
                console.log('Changing to page:', newPage);
                appState.currentPage = newPage;
                loadProducts();
                
                // Scroll to products section
                scrollToSection('products');
            }
        });
    });
}

// Setup product interactions
function setupProductInteractions() {
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
            const productId = parseInt(e.target.dataset.productId);
            const product = allProducts.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
                
                // Visual feedback
                const button = e.target;
                const originalText = button.textContent;
                button.textContent = 'Added!';
                button.style.background = '#d4af37';
                button.style.color = '#1a1a1a';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                    button.style.color = '';
                    button.disabled = false;
                }, 1500);
            }
        }
    });
}

// Cart management
function addToCart(product) {
    const existingItem = appState.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartTotal();
    updateCartDisplay();
    console.log('Added to cart:', product.name, '- Cart total:', appState.cartTotal);
}

function updateCartTotal() {
    appState.cartTotal = appState.cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

function updateCartDisplay() {
    const cartPriceElement = document.querySelector('.cart-price');
    if (cartPriceElement) {
        cartPriceElement.textContent = `$${appState.cartTotal}`;
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    }
    
    // Arrow key navigation for pagination
    if (e.key === 'ArrowLeft' && appState.currentPage > 1) {
        appState.currentPage--;
        loadProducts();
        scrollToSection('products');
    }
    
    if (e.key === 'ArrowRight') {
        const filteredProducts = getFilteredProducts();
        const totalPages = Math.ceil(filteredProducts.length / appState.itemsPerPage);
        if (appState.currentPage < totalPages) {
            appState.currentPage++;
            loadProducts();
            scrollToSection('products');
        }
    }
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    console.log('Window resized - recalculating layouts');
}, 250));

// Performance optimization
const preloadImages = () => {
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PC9zdmc+';
};

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    
    // Mark page as loaded
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Export for testing (if in development)
if (typeof window !== 'undefined') {
    window.fashionApp = {
        appState,
        categories,
        allProducts,
        loadProducts,
        addToCart,
        updateCartTotal,
        scrollToSection
    };
}

// Matching functionality
function setupMatchingFeature() {
    const matchingBtn = document.getElementById('matchingBtn');
    const matchingOverlay = document.getElementById('matchingOverlay');
    const matchingClose = document.getElementById('matchingClose');
    const matchingCardContainer = document.getElementById('matchingCardContainer');
    const matchingProgress = document.getElementById('matchingProgress');
    
    let currentMatchingIndex = 0;
    let matchingProducts = [];
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let isAnimating = false;
    
    if (!matchingBtn) return;
    
    matchingBtn.addEventListener('click', openMatchingOverlay);
    matchingClose.addEventListener('click', closeMatchingOverlay);
    matchingOverlay.addEventListener('click', (e) => {
        if (e.target === matchingOverlay) closeMatchingOverlay();
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!matchingOverlay.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            swipeCard('left');
        } else if (e.key === 'ArrowRight') {
            swipeCard('right');
        } else if (e.key === 'Escape') {
            closeMatchingOverlay();
        }
    });
    
    function openMatchingOverlay() {
        // Get 10 random products
        matchingProducts = [...allProducts].sort(() => Math.random() - 0.5).slice(0, 10);
        currentMatchingIndex = 0;
        
        matchingOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        loadMatchingCard();
    }
    
    function closeMatchingOverlay() {
        matchingOverlay.classList.remove('active');
        document.body.style.overflow = '';
        matchingCardContainer.innerHTML = '';
        currentMatchingIndex = 0;
        isAnimating = false;
    }
    
    function loadMatchingCard() {
        if (currentMatchingIndex >= matchingProducts.length) {
            closeMatchingOverlay();
            return;
        }
        
        const product = matchingProducts[currentMatchingIndex];
        matchingProgress.textContent = `${currentMatchingIndex + 1}/10`;
        
        const card = document.createElement('div');
        card.className = 'matching-card';
        card.innerHTML = `
            <div class="matching-card-image">
                <span>${product.name}</span>
            </div>
            <div class="matching-card-info">
                <div class="matching-card-name">${product.name}</div>
                <div class="matching-card-price">$${product.price}</div>
            </div>
        `;
        
        // Add swipe functionality
        setupSwipeListeners(card);
        
        matchingCardContainer.innerHTML = '';
        matchingCardContainer.appendChild(card);
        
        // Entrance animation
        setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }
    
    function setupSwipeListeners(card) {
        // Mouse events
        card.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        
        // Touch events
        card.addEventListener('touchstart', startDrag, { passive: true });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);
        
        function startDrag(e) {
            if (isAnimating) return;
            
            isDragging = true;
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            currentX = startX;
            
            card.style.transition = 'none';
        }
        
        function drag(e) {
            if (!isDragging || isAnimating) return;
            
            e.preventDefault();
            currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const deltaX = currentX - startX;
            const rotation = deltaX * 0.1;
            
            card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
            
            // Add visual feedback
            const opacity = 1 - Math.abs(deltaX) / 300;
            card.style.opacity = Math.max(0.7, opacity);
        }
        
        function endDrag() {
            if (!isDragging || isAnimating) return;
            
            isDragging = false;
            const deltaX = currentX - startX;
            const threshold = 80;
            
            card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            
            if (Math.abs(deltaX) > threshold) {
                swipeCard(deltaX > 0 ? 'right' : 'left');
            } else {
                // Snap back
                card.style.transform = 'translateX(0) rotate(0deg)';
                card.style.opacity = '1';
            }
        }
    }
    
    function swipeCard(direction) {
        if (isAnimating) return;
        
        isAnimating = true;
        const card = matchingCardContainer.querySelector('.matching-card');
        
        if (!card) return;
        
        card.classList.add(`swipe-${direction}`);
        
        setTimeout(() => {
            currentMatchingIndex++;
            isAnimating = false;
            loadMatchingCard();
        }, 500);
    }
}

// Add to the initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupMatchingFeature(); // Add this line
});

// Wishlist functionality
function setupWishlistFeature() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Add click handler to wishlist icon in header
    const wishlistIcon = document.querySelector('.nav__icon[title="Wishlist"]');
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', () => {
            window.location.href = '../pages/wishlist.html';
        });
    }
    
    // Function to add item to wishlist
    window.addToWishlist = function(product) {
        // Check if already in wishlist
        const existingIndex = wishlist.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
            showNotification('Already in wishlist!', 'info');
            return;
        }
        
        // Add timestamp
        const wishlistItem = {
            ...product,
            dateAdded: new Date().toISOString()
        };
        
        wishlist.push(wishlistItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistBadge();
        showNotification('Added to wishlist!', 'success');
    };
    
    // Update wishlist badge
    function updateWishlistBadge() {
        let badge = wishlistIcon.querySelector('.wishlist-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'wishlist-badge';
            wishlistIcon.appendChild(badge);
        }
        
        const count = wishlist.length;
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }
    
    // Initialize badge
    updateWishlistBadge();
}

// Initialize application
function initializeApp() {
    console.log('Initializing TRUE CLASSICS Fashion Website...');
    
    setTimeout(() => {
        setupNavigation();
        setupAnimations();
        setupFilters();
        populateCategorySelect();
        setupProductInteractions();
        loadRecommendedProducts();
        loadProducts();
        updateCartDisplay();
        setupMatchingFeature(); // Your existing matching feature
        setupWishlistFeature(); // Add this line
        console.log('TRUE CLASSICS Fashion Website Initialized Successfully');
    }, 100);
}

// cart icon click handler:
const cartIcon = document.querySelector('.nav__cart');
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        window.location.href = '../pages/cart.html';
    });
}
