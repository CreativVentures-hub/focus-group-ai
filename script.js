// Focus Group System JavaScript

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    console.error('Error details:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
    alert('JavaScript Error: ' + e.message + ' at line ' + e.lineno);
});

// Also catch unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    alert('Unhandled Promise Error: ' + e.reason);
});

// Global login function for onclick handler
window.handleLoginClick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Global login function called!');
    
    const passwordInput = document.getElementById('passwordInput');
    if (!passwordInput) {
        console.error('Password input not found in global function');
        alert('Error: Password input not found');
        return false;
    }
    
    const password = passwordInput.value.trim();
    console.log('Password from global function:', password ? '***' : 'empty');
    console.log('Expected password:', CONFIG.PASSWORD);
    
    if (password === CONFIG.PASSWORD) {
        console.log('Password correct in global function!');
        sessionStorage.setItem('focusGroupLoggedIn', 'true');
        
        // Show main section
        const loginSection = document.getElementById('loginSection');
        const mainSection = document.getElementById('mainSection');
        
        if (loginSection && mainSection) {
            loginSection.style.display = 'none';
            mainSection.style.display = 'block';
            
            // Initialize the rest of the app
            if (typeof populateDropdowns === 'function') {
                populateDropdowns();
            }
            if (typeof clearLoginForm === 'function') {
                clearLoginForm();
            }
        }
    } else {
        console.log('Password incorrect in global function!');
        const loginError = document.getElementById('loginError');
        if (loginError) {
            loginError.style.display = 'block';
            setTimeout(() => {
                loginError.style.display = 'none';
            }, 3000);
        }
    }
    
    return false;
};

// DOM Elements - will be initialized after DOM loads
let loginSection, mainSection, loginForm, passwordInput, loginError, logoutBtn;
let focusGroupForm, sessionTypeSelect;
let categorySearch, categoryTabs, categoryList, categoryHidden, selectedCategoriesContainer;
let categoryModal, openCategoryModal, closeCategoryModal, applyCategories, clearAllCategories;
let categoryButtonText, categoryCount, numberOfParticipantsSlider, numberOfParticipantsValue;
let successModal, closeSuccessModal, closeSuccessModalBtn, userEmailDisplay;

// Language management
let currentLanguage = 'en';
let languageSelect;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing elements...');
    
    // Initialize all DOM elements
    initializeDOMElements();
    
    initializeApp();
    setupEventListeners();
    
    // Initialize language
    initializeLanguage();
    
    // Show GitHub Pages notice if on GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        showGitHubPagesNotice();
    }
});

function initializeDOMElements() {
    console.log('Initializing DOM elements...');
    
    // Login elements
    loginSection = document.getElementById('loginSection');
    mainSection = document.getElementById('mainSection');
    loginForm = document.getElementById('loginForm');
    passwordInput = document.getElementById('passwordInput');
    loginError = document.getElementById('loginError');
    logoutBtn = document.getElementById('logoutBtn');
    
    // Form elements
    focusGroupForm = document.getElementById('focusGroupForm');
    sessionTypeSelect = document.getElementById('sessionType');
    
    // Category elements
    categorySearch = document.getElementById('categorySearch');
    categoryTabs = document.getElementById('categoryTabs');
    categoryList = document.getElementById('categoryList');
    categoryHidden = document.getElementById('category');
    selectedCategoriesContainer = document.getElementById('selectedCategories');
    categoryModal = document.getElementById('categoryModal');
    openCategoryModal = document.getElementById('openCategoryModal');
    closeCategoryModal = document.getElementById('closeCategoryModal');
    applyCategories = document.getElementById('applyCategories');
    clearAllCategories = document.getElementById('clearAllCategories');
    categoryButtonText = document.getElementById('categoryButtonText');
    categoryCount = document.getElementById('categoryCount');
    
    // Slider elements
    numberOfParticipantsSlider = document.getElementById('numberOfParticipants');
    numberOfParticipantsValue = document.getElementById('numberOfParticipantsValue');
    
    // Success modal elements
    successModal = document.getElementById('successModal');
    closeSuccessModal = document.getElementById('closeSuccessModal');
    closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
    userEmailDisplay = document.getElementById('userEmailDisplay');
    
    // Language element
    languageSelect = document.getElementById('languageSelect');
    
    console.log('DOM elements initialized:', {
        loginSection: !!loginSection,
        mainSection: !!mainSection,
        loginForm: !!loginForm,
        passwordInput: !!passwordInput,
        loginError: !!loginError,
        logoutBtn: !!logoutBtn,
        successModal: !!successModal
    });
}

function initializeApp() {
    // Show login section by default
    showLoginSection();
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login functionality
    if (loginForm) {
        console.log('Adding login form event listener');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error('Login form not found!');
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Form submissions
    if (focusGroupForm) {
        focusGroupForm.addEventListener('submit', handleFocusGroupForm);
    }
    
    // Session type change
    if (sessionTypeSelect) {
        sessionTypeSelect.addEventListener('change', handleSessionTypeChange);
    }
    
    // Success modal events
    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', closeSuccessModalHandler);
    }
    if (closeSuccessModalBtn) {
        closeSuccessModalBtn.addEventListener('click', closeSuccessModalHandler);
    }
    
    // Category modal events
    setupCategoryModal();
    
    // Setup all demographic modals
    setupDemographicModals();
    
    // Initialize all selection buttons with default text
    initializeSelectionButtons();
    
    // Initialize slider
    initializeSlider();
}

function handleLogin(e) {
    e.preventDefault();
    console.log('Login function called!');
    
    if (!passwordInput) {
        console.error('Password input element not found!');
        alert('Error: Password input not found. Please refresh the page.');
        return;
    }
    
    const password = passwordInput.value.trim();
    console.log('Password entered:', password ? '***' : 'empty');
    console.log('Expected password:', CONFIG.PASSWORD);
    
    if (password === CONFIG.PASSWORD) {
        console.log('Password correct! Logging in...');
        sessionStorage.setItem('focusGroupLoggedIn', 'true');
        
        showMainSection();
        populateDropdowns();
        clearLoginForm();
    } else {
        console.log('Password incorrect!');
        showLoginError();
    }
}

function handleLogout() {
    sessionStorage.removeItem('focusGroupLoggedIn');
    showLoginSection();
    clearLoginForm();
}

function handleSessionTypeChange() {
    const selectedType = sessionTypeSelect.value;
    const sessionFields = document.getElementById('sessionFields');
    
    // Hide all session type fields first
    const allSessionTypeFields = document.querySelectorAll('.session-type-fields');
    allSessionTypeFields.forEach(field => {
        field.style.display = 'none';
    });
    
    // Show session fields container
    if (sessionFields) {
        sessionFields.style.display = 'block';
    }
    
    // Show specific fields based on session type
    switch (selectedType) {
        case 'product_research':
            const productFields = document.getElementById('productResearchFields');
            if (productFields) productFields.style.display = 'block';
            initializeQuestions('productQuestions', 10);
            setupCharacterCounters();
            break;
        case 'market_research':
            const marketFields = document.getElementById('marketResearchFields');
            if (marketFields) marketFields.style.display = 'block';
            initializeQuestions('marketQuestions', 10);
            setupCharacterCounters();
            break;
        case 'brand_perception':
            const brandFields = document.getElementById('brandPerceptionFields');
            if (brandFields) brandFields.style.display = 'block';
            initializeQuestions('brandQuestions', 10);
            setupCharacterCounters();
            break;
    }
}

async function handleFocusGroupForm(e) {
    e.preventDefault();
    
    const formData = new FormData(focusGroupForm);
    const selectedCategories = getSelectedCategories();
    const userEmail = formData.get('userEmail');
    
    // Validate required fields
    if (selectedCategories.length === 0) {
        showFormError(focusGroupForm, 'Please select at least one participant category');
        return;
    }
    
    if (!formData.get('sessionType')) {
        showFormError(focusGroupForm, 'Please select a session type');
        return;
    }
    
    if (!formData.get('sessionName')) {
        showFormError(focusGroupForm, 'Please enter a session name');
        return;
    }
    
    if (!userEmail) {
        showFormError(focusGroupForm, 'Please enter your email address');
        return;
    }
    
    // Prepare webhook data
    const sliderValue = formData.get('numberOfParticipants') || (numberOfParticipantsSlider ? numberOfParticipantsSlider.value : '8');
    
    // Get all selected demographic data
    const selectedGenders = window.selectedGenders || [];
    const selectedAges = window.selectedAges || [];
    const selectedIncomes = window.selectedIncomes || [];
    const selectedMaritals = window.selectedMaritals || [];
    const selectedChildren = window.selectedChildren || [];
    const selectedEducations = window.selectedEducations || [];
    const selectedRaces = window.selectedRaces || [];
    
    // Format categories for n8n (convert to snake_case)
    const formattedCategories = selectedCategories.map(cat => {
        if (cat.startsWith('Pet - ')) {
            return cat.toLowerCase().replace('pet - ', 'pet_').replace(/[\s-]+/g, '_');
        }
        return cat.replace(/&/g, 'and').toLowerCase().replace(/[\s-]+/g, '_');
    });
    
    // Format demographic data for n8n
    const formatDemographics = (items) => {
        if (!items || items.length === 0) return ['any'];
        return items.map(item => item.toLowerCase().replace(/[\s-]+/g, '_'));
    };
    
    // Collect session-specific data based on session type
    const sessionType = formData.get('sessionType');
    let sessionSpecificData = {};
    
    switch (sessionType) {
        case 'product_research':
            sessionSpecificData = {
                product_name: formData.get('productName') || '',
                product_description: formData.get('productDescription') || '',
                questions: collectQuestions('productQuestions')
            };
            break;
        case 'market_research':
            sessionSpecificData = {
                market_name: formData.get('marketName') || '',
                market_description: formData.get('marketDescription') || '',
                questions: collectQuestions('marketQuestions')
            };
            break;
        case 'brand_perception':
            sessionSpecificData = {
                brand_name: formData.get('brandName') || '',
                brand_description: formData.get('brandDescription') || '',
                questions: collectQuestions('brandQuestions')
            };
            break;
    }
    
    const webhookData = {
        // Session information
        session_type: sessionType,
        session_name: formData.get('sessionName'),
        number_of_participants: parseInt(sliderValue),
        user_email: userEmail,
        
        // Session-specific data
        ...sessionSpecificData,
        
        // Participant selection criteria
        categories: formattedCategories,
        gender: formatDemographics(selectedGenders),
        age_range: formatDemographics(selectedAges),
        income_range: formatDemographics(selectedIncomes),
        marital_status: formatDemographics(selectedMaritals),
        has_children: formatDemographics(selectedChildren),
        education_level: formatDemographics(selectedEducations),
        race: formatDemographics(selectedRaces),
        
        // Metadata
        timestamp: new Date().toISOString(),
        source: 'focus_group_ui'
    };
    
    console.log('Sending webhook data:', webhookData);
    
    try {
        // Send to n8n webhook
        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
        });
        
        console.log('Webhook response status:', response.status);
        
        if (response.ok) {
            // Show success modal
            showSuccessModal(userEmail);
        } else {
            showFormError(focusGroupForm, `Error: ${response.status} ${response.statusText}`);
        }
        
    } catch (error) {
        console.error('Error sending webhook:', error);
        showFormError(focusGroupForm, 'Network error. Please try again.');
    }
}

function showSuccessModal(email) {
    if (userEmailDisplay) {
        userEmailDisplay.textContent = email;
    }
    if (successModal) {
        successModal.style.display = 'flex';
    }
}

function closeSuccessModalHandler() {
    if (successModal) {
        successModal.style.display = 'none';
    }
    // Reset form
    if (focusGroupForm) {
        focusGroupForm.reset();
    }
}

function showMainSection() {
    if (loginSection && mainSection) {
        loginSection.style.display = 'none';
        mainSection.style.display = 'block';
        
        // Re-initialize slider after showing main section
        setTimeout(() => {
            initializeSlider();
        }, 100);
    }
}

function showLoginSection() {
    if (mainSection && loginSection) {
        mainSection.style.display = 'none';
        loginSection.style.display = 'block';
    }
}

function clearLoginForm() {
    if (loginForm) {
        loginForm.reset();
    }
    if (loginError) {
        loginError.style.display = 'none';
    }
}

function showLoginError() {
    if (loginError) {
        loginError.style.display = 'block';
    }
    if (passwordInput) {
        passwordInput.focus();
    }
    
    // Clear error after 3 seconds
    setTimeout(() => {
        if (loginError) {
            loginError.style.display = 'none';
        }
    }, 3000);
}

function showFormError(form, message) {
    console.log('Showing form error:', message);
    
    // Remove any existing error messages
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    form.appendChild(errorDiv);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Placeholder functions for compatibility
function populateDropdowns() {
    console.log('Populate dropdowns called');
    // Implementation would go here
}

function getSelectedCategories() {
    return window.selectedCategories || [];
}

function collectQuestions(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    
    const questions = [];
    const questionInputs = container.querySelectorAll('.question-input');
    
    questionInputs.forEach(input => {
        const text = input.value.trim();
        if (text) {
            questions.push({ text: text });
        }
    });
    
    return questions;
}

function initializeQuestions(containerId, maxQuestions) {
    console.log('Initialize questions called for:', containerId);
    // Implementation would go here
}

function setupCharacterCounters() {
    console.log('Setup character counters called');
    // Implementation would go here
}

function setupCategoryModal() {
    console.log('Setup category modal called');
    // Implementation would go here
}

function setupDemographicModals() {
    console.log('Setup demographic modals called');
    // Implementation would go here
}

function initializeSelectionButtons() {
    console.log('Initialize selection buttons called');
    // Implementation would go here
}

function initializeSlider() {
    console.log('Initialize slider called');
    // Implementation would go here
}

function initializeLanguage() {
    console.log('Initialize language called');
    // Implementation would go here
}

function showGitHubPagesNotice() {
    console.log('Show GitHub Pages notice called');
    // Implementation would go here
}








