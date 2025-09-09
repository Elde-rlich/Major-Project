// Global state
let selectedUserType = null;
let currentForm = 'login';

// Form switching functions
function showLoginForm() {
    console.log('Showing login form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm && signupForm) {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        currentForm = 'login';
        clearAllErrors();
    }
}

function showSignupForm() {
    console.log('Showing signup form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm && signupForm) {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        currentForm = 'signup';
        resetSignupForm();
        clearAllErrors();
    }
}

// User type selection
function selectUserType(type) {
    console.log('Selected user type:', type);
    selectedUserType = type;
    const userTypeBtn = document.getElementById('userTypeBtn');
    if (userTypeBtn) {
        userTypeBtn.disabled = false;
    }
}

function proceedToSignupForm() {
    console.log('Proceeding to signup details with type:', selectedUserType);
    if (!selectedUserType) {
        alert('Please select a user type');
        return;
    }
    
    const userTypeSelection = document.getElementById('userTypeSelection');
    const signupDetailsForm = document.getElementById('signupDetailsForm');
    const businessNameGroup = document.getElementById('businessNameGroup');
    
    if (userTypeSelection && signupDetailsForm) {
        userTypeSelection.classList.add('hidden');
        signupDetailsForm.classList.remove('hidden');
        
        // Show business name field for sellers
        if (selectedUserType === 'seller' && businessNameGroup) {
            businessNameGroup.classList.remove('hidden');
        }
    }
}

function resetSignupForm() {
    console.log('Resetting signup form');
    selectedUserType = null;
    
    const userTypeSelection = document.getElementById('userTypeSelection');
    const signupDetailsForm = document.getElementById('signupDetailsForm');
    const businessNameGroup = document.getElementById('businessNameGroup');
    const userTypeBtn = document.getElementById('userTypeBtn');
    
    if (userTypeSelection) userTypeSelection.classList.remove('hidden');
    if (signupDetailsForm) signupDetailsForm.classList.add('hidden');
    if (businessNameGroup) businessNameGroup.classList.add('hidden');
    if (userTypeBtn) userTypeBtn.disabled = true;
    
    // Clear radio buttons
    const radios = document.querySelectorAll('input[name="userType"]');
    radios.forEach(radio => radio.checked = false);
    
    // Clear form fields
    const inputs = document.querySelectorAll('#signupDetailsForm input');
    inputs.forEach(input => input.value = '');
}

// Password visibility toggle
function togglePasswordVisibility(inputId) {
    console.log('Toggling password for:', inputId);
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    const icon = toggle.querySelector('i');
    
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password);
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// Form submission handlers
async function handleLoginSubmit() {
    console.log('Handling login submit');
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) {
        console.error('Login inputs not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Clear previous errors
    clearAllErrors();
    
    // Validation
    let isValid = true;
    if (!email) {
        showError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('loginEmail', 'Please enter a valid email');
        isValid = false;
    }
    
    if (!password) {
        showError('loginPassword', 'Password is required');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading state
    const button = event.target;
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    button.disabled = true;
    if (btnText) btnText.classList.add('hidden');
    if (btnLoader) btnLoader.classList.remove('hidden');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showSuccessMessage('Login successful! Welcome back.');
        
        // Clear form
        emailInput.value = '';
        passwordInput.value = '';
        
    } catch (error) {
        showError('loginPassword', 'Invalid credentials');
    } finally {
        // Reset button
        button.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoader) btnLoader.classList.add('hidden');
    }
}

async function handleSignupSubmit() {
    console.log('Handling signup submit');
    
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const businessNameInput = document.getElementById('businessName');
    
    if (!emailInput || !passwordInput || !confirmPasswordInput) {
        console.error('Signup inputs not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const businessName = businessNameInput ? businessNameInput.value.trim() : '';
    
    // Clear previous errors
    clearAllErrors();
    
    // Validation
    let isValid = true;
    
    if (!email) {
        showError('signupEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('signupEmail', 'Please enter a valid email');
        isValid = false;
    }
    
    if (!password) {
        showError('signupPassword', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError('signupPassword', 'Password must be 8+ chars with uppercase, lowercase, and number');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    if (selectedUserType === 'seller' && !businessName) {
        showError('businessName', 'Business name is required');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading state
    const button = event.target;
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    button.disabled = true;
    if (btnText) btnText.classList.add('hidden');
    if (btnLoader) btnLoader.classList.remove('hidden');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showSuccessMessage(`Account created successfully! Welcome to our ${selectedUserType} community.`);
        
        // Switch to login after success
        setTimeout(() => {
            showLoginForm();
        }, 2000);
        
    } catch (error) {
        showError('signupEmail', 'An error occurred. Please try again.');
    } finally {
        // Reset button
        button.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoader) btnLoader.classList.add('hidden');
    }
}

function handleGoogleAuth() {
    console.log('Google auth clicked');
    showSuccessMessage('Google Sign-In would be integrated here.');
}

function showSuccessMessage(message) {
    console.log('Showing success:', message);
    
    // Remove existing notifications
    const existing = document.querySelectorAll('.success-notification');
    existing.forEach(el => el.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    showLoginForm();
});