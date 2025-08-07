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
});

// Also catch unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Global login function for onclick handler
window.handleLoginClick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const passwordInput = document.getElementById('passwordInput');
    if (!passwordInput) {
        console.error('Password input not found in global function');
        return false;
    }
    
    const password = passwordInput.value.trim();
    
    if (password === CONFIG.PASSWORD) {
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
let buyingBehaviorsSearch, buyingBehaviorsList, selectedBuyingBehaviorsContainer;
let buyingBehaviorsModal, openBuyingBehaviorsModal, closeBuyingBehaviorsModal, applyBuyingBehaviors, clearAllBuyingBehaviors;
let buyingBehaviorsButtonText, buyingBehaviorsCount;

let productCategoriesSearch, productCategoriesList, selectedProductCategoriesContainer;
let productCategoriesModal, openProductCategoriesModal, closeProductCategoriesModal, applyProductCategories, clearAllProductCategories;
let productCategoriesButtonText, productCategoriesCount;
let successModal, closeSuccessModal, closeSuccessModalBtn, userEmailDisplay;

// Language management
let currentLanguage = 'en';
let languageSelect;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all DOM elements
    initializeDOMElements();
    
    initializeApp();
    setupEventListeners();
    
    // Initialize language
    initializeLanguage();
    

});

function initializeDOMElements() {
    
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
    
    // Buying behaviors modal elements
    buyingBehaviorsSearch = document.getElementById('buyingBehaviorsSearch');
    buyingBehaviorsList = document.getElementById('buyingBehaviorsList');
    selectedBuyingBehaviorsContainer = document.getElementById('selectedChips');
    buyingBehaviorsModal = document.getElementById('buyingBehaviorsModal');
    openBuyingBehaviorsModal = document.getElementById('openBuyingBehaviorsModal');
    closeBuyingBehaviorsModal = document.getElementById('closeBuyingBehaviorsModal');
    applyBuyingBehaviors = document.getElementById('applyBuyingBehaviors');
    clearAllBuyingBehaviors = document.getElementById('clearAllBuyingBehaviors');
    buyingBehaviorsButtonText = document.getElementById('buyingBehaviorsButtonText');
    buyingBehaviorsCount = document.getElementById('buyingBehaviorsCount');

    // Product categories modal elements
    productCategoriesSearch = document.getElementById('productCategoriesSearch');
    productCategoriesList = document.getElementById('productCategoriesList');
    selectedProductCategoriesContainer = document.getElementById('selectedChips');
    productCategoriesModal = document.getElementById('productCategoriesModal');
    openProductCategoriesModal = document.getElementById('openProductCategoriesModal');
    closeProductCategoriesModal = document.getElementById('closeProductCategoriesModal');
    applyProductCategories = document.getElementById('applyProductCategories');
    clearAllProductCategories = document.getElementById('clearAllProductCategories');
    productCategoriesButtonText = document.getElementById('productCategoriesButtonText');
    productCategoriesCount = document.getElementById('productCategoriesCount');
    
    // Slider elements
    // Slider elements removed - using fixed 10 participants
    
    // Success modal elements
    successModal = document.getElementById('successModal');
    closeSuccessModal = document.getElementById('closeSuccessModal');
    closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
    userEmailDisplay = document.getElementById('userEmailDisplay');
    
    // Language element
    languageSelect = document.getElementById('languageSelect');
    
    // Log any missing critical elements
    if (!loginSection || !mainSection || !focusGroupForm) {
        console.warn('Some critical DOM elements not found');
    }
}

function initializeApp() {
    // Show login section by default
    showLoginSection();
    
    // Initialize language system
    initializeLanguage();
    
    // Force English mode on initial load to ensure everything is in English
    setTimeout(() => {
        forceEnglishMode();
    }, 100);
    
    // Add global function for debugging - you can call forceEnglish() in console
    window.forceEnglish = forceEnglishMode;
}

function setupEventListeners() {
    // Login functionality
    if (loginForm) {
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
    setupBuyingBehaviorsModal();
    setupProductCategoriesModal();
    
    // Setup all demographic modals
    setupDemographicModals();
    
    // Initialize all selection buttons with default text
    initializeSelectionButtons();
}

function handleLogin(e) {
    e.preventDefault();
    
    if (!passwordInput) {
        console.error('Password input element not found!');
        return;
    }
    
    const password = passwordInput.value.trim();
    
    if (password === CONFIG.PASSWORD) {
        sessionStorage.setItem('focusGroupLoggedIn', 'true');
        
        showMainSection();
        populateDropdowns();
        clearLoginForm();
        
        // Trigger session type change to show appropriate fields
        handleSessionTypeChange();
    } else {
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
            // AI will generate questions from product name, description, and image
            break;
        case 'market_research':
            const marketFields = document.getElementById('marketResearchFields');
            if (marketFields) marketFields.style.display = 'block';
            // AI will generate questions from market description
            break;
        case 'brand_perception':
            const brandFields = document.getElementById('brandPerceptionFields');
            if (brandFields) brandFields.style.display = 'block';
            // AI will generate questions from brand name, description, and image
            break;
    }
    
    // Setup character counters once after showing fields
    setupCharacterCounters();
    
    // Setup file upload feedback
    setupFileUploads();
}

function handleFocusGroupForm(e) {
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
    const numberOfParticipants = 10; // Fixed to standard focus group size
    
    // Get all selected demographic data
    const selectedGenders = window.selectedGenders || [];
    const selectedAges = window.selectedAges || [];
    const selectedIncomes = window.selectedIncomes || [];
    const selectedMaritals = window.selectedMaritals || [];
    const selectedChildren = window.selectedChildren || [];
    const selectedEducations = window.selectedEducations || [];
    const selectedRaces = window.selectedRaces || [];
    
    // Format buying behaviors and product categories for n8n (convert to snake_case)
    const buyingBehaviors = window.selectedBuyingBehaviors || [];
    const productCategories = window.selectedProductCategories || [];
    
    const formatCategories = (categories) => {
        return categories.map(cat => {
            if (cat === 'Any') return 'any';
            if (cat.startsWith('Pet - ')) {
                return cat.toLowerCase().replace('pet - ', 'pet_').replace(/[\s-]+/g, '_');
            }
            return cat.replace(/&/g, 'and').toLowerCase().replace(/[\s-]+/g, '_');
        });
    };
    
    const formattedBuyingBehaviors = formatCategories(buyingBehaviors);
    const formattedProductCategories = formatCategories(productCategories);
    
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
                product_image: formData.get('productImage') ? 'image_provided' : 'no_image'
                // AI will generate questions from product name, description, and image
            };
            break;
        case 'market_research':
            sessionSpecificData = {
                market_name: formData.get('marketName') || '',
                market_description: formData.get('marketDescription') || ''
                // AI will generate questions from market description
            };
            break;
        case 'brand_perception':
            sessionSpecificData = {
                brand_name: formData.get('brandName') || '',
                brand_description: formData.get('brandDescription') || '',
                brand_image: formData.get('brandImage') ? 'image_provided' : 'no_image'
                // AI will generate questions from brand name, description, and image
            };
            break;
    }
    
    const webhookData = {
        // Session information
        session_type: sessionType,
        session_name: formData.get('sessionName'),
        number_of_participants: numberOfParticipants,
        user_email: userEmail,
        
        // Session-specific data
        ...sessionSpecificData,
        
        // Participant selection criteria
        buying_behaviors: formattedBuyingBehaviors,
        product_categories: formattedProductCategories,
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
    
    // Validate webhook data before sending
    const validationResult = validateWebhookData(webhookData);
    if (!validationResult.isValid) {
        showFormError(focusGroupForm, validationResult.message);
        return;
    }
    
    // Send to n8n webhook (fire and forget)
    fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
    }).catch(error => {
        console.error('Error sending webhook:', error);
        // Don't show error to user - just log it
    });
    
    // Show success modal immediately after sending
    showSuccessModal(userEmail);
}

function showSuccessModal(email) {
    if (userEmailDisplay) {
        userEmailDisplay.textContent = email;
    }
    
    if (successModal) {
        successModal.style.display = 'flex';
        } else {
        console.error('Success modal element not found!');
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

// Session types and categories management
function populateDropdowns() {
    // Populate session types
    if (sessionTypeSelect) {
        const translations = CONFIG.TRANSLATIONS[currentLanguage] || CONFIG.TRANSLATIONS.en;
        
        sessionTypeSelect.innerHTML = `<option value="">${translations.selectSessionType}</option>`;
        
        CONFIG.SESSION_TYPES.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            
            // Map session type values to translation keys
            let translatedLabel = '';
            switch (type.value) {
                case 'market_research':
                    translatedLabel = translations.marketResearch;
                    break;
                case 'product_research':
                    translatedLabel = translations.productResearch;
                    break;
                case 'user_experience':
                    translatedLabel = translations.userExperience;
                    break;
                case 'customer_feedback':
                    translatedLabel = translations.customerFeedback;
                    break;
                case 'brand_perception':
                    translatedLabel = translations.brandPerception;
                    break;
                case 'competitive_analysis':
                    translatedLabel = translations.competitiveAnalysis;
                    break;
                case 'advertising_testing':
                    translatedLabel = translations.advertisingTesting;
                    break;
                case 'pricing_research':
                    translatedLabel = translations.pricingResearch;
                    break;
                case 'concept_validation':
                    translatedLabel = translations.conceptValidation;
                    break;
                case 'satisfaction_survey':
                    translatedLabel = translations.satisfactionSurvey;
                    break;
                default:
                    translatedLabel = type.label;
            }
            
            option.textContent = translatedLabel;
            if (type.disabled) {
                option.disabled = true;
                option.textContent += ` (${translations.comingSoon})`;
            }
            sessionTypeSelect.appendChild(option);
        });
        
        // Set Market Research as default
        sessionTypeSelect.value = 'market_research';
        
        // Trigger the change event to show the market research fields
        const changeEvent = new Event('change');
        sessionTypeSelect.dispatchEvent(changeEvent);
    }
    
    // Initialize category modal
    setupCategoryModal();
}

function getSelectedCategories() {
    const buyingBehaviors = window.selectedBuyingBehaviors || [];
    const productCategories = window.selectedProductCategories || [];
    return [...buyingBehaviors, ...productCategories];
}

function validateWebhookData(data) {
    const errors = [];
    
    // Check required fields
    if (!data.session_type) errors.push('Session type is required');
    if (!data.session_name) errors.push('Session name is required');
    if (!data.user_email) errors.push('Email address is required');
    if (!data.number_of_participants) errors.push('Number of participants is required');
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.user_email && !emailRegex.test(data.user_email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Check buying behaviors and product categories
    const buyingBehaviors = data.buying_behaviors || [];
    const productCategories = data.product_categories || [];
    
    if (buyingBehaviors.length === 0 && productCategories.length === 0) {
        errors.push('Please select at least one buying behavior or product category');
    }
    
    // Check session-specific data
    if (data.session_type === 'market_research') {
        if (!data.market_name) errors.push('Market name is required');
        if (!data.market_description) errors.push('Market description is required');
    } else if (data.session_type === 'product_research') {
        if (!data.product_name) errors.push('Product name is required');
        if (!data.product_description) errors.push('Product description is required');
    } else if (data.session_type === 'brand_perception') {
        if (!data.brand_name) errors.push('Brand name is required');
        if (!data.brand_description) errors.push('Brand description is required');
    }
    
    if (errors.length > 0) {
        return {
            isValid: false,
            message: 'Please fix the following errors:\n• ' + errors.join('\n• ')
        };
    }
    
    return { isValid: true };
}

// Question functions removed - AI will generate questions automatically



function setupCharacterCounters() {
    // Only setup counters for fields that still have maxlength attributes
    const textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(textarea => {
        // Check if counter already exists
        const existingCounter = textarea.parentNode.querySelector('.char-count');
        if (existingCounter) {
            return; // Skip if counter already exists
        }
        
        const counter = document.createElement('div');
        counter.className = 'char-count';
        textarea.parentNode.appendChild(counter);
        
        const updateCount = () => {
            const remaining = textarea.maxLength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining <= 50) {
                counter.className = 'char-count warning';
            } else if (remaining <= 0) {
                counter.className = 'char-count error';
            } else {
                counter.className = 'char-count';
            }
        };
        
        textarea.addEventListener('input', updateCount);
        updateCount();
    });
}

// Buying behaviors modal functionality
function setupBuyingBehaviorsModal() {
    console.log('Setting up buying behaviors modal...');
    console.log('openBuyingBehaviorsModal:', openBuyingBehaviorsModal);
    console.log('closeBuyingBehaviorsModal:', closeBuyingBehaviorsModal);
    console.log('applyBuyingBehaviors:', applyBuyingBehaviors);
    console.log('clearAllBuyingBehaviors:', clearAllBuyingBehaviors);
    console.log('buyingBehaviorsSearch:', buyingBehaviorsSearch);
    
    if (openBuyingBehaviorsModal) {
        openBuyingBehaviorsModal.addEventListener('click', showBuyingBehaviorsModal);
        console.log('Added click listener to openBuyingBehaviorsModal');
    } else {
        console.error('openBuyingBehaviorsModal element not found!');
    }
    if (closeBuyingBehaviorsModal) {
        closeBuyingBehaviorsModal.addEventListener('click', hideBuyingBehaviorsModal);
        console.log('Added click listener to closeBuyingBehaviorsModal');
    } else {
        console.error('closeBuyingBehaviorsModal element not found!');
    }
    if (applyBuyingBehaviors) {
        applyBuyingBehaviors.addEventListener('click', applyBuyingBehaviorsSelection);
        console.log('Added click listener to applyBuyingBehaviors');
    } else {
        console.error('applyBuyingBehaviors element not found!');
    }
    if (clearAllBuyingBehaviors) {
        clearAllBuyingBehaviors.addEventListener('click', clearAllBuyingBehaviorsSelections);
        console.log('Added click listener to clearAllBuyingBehaviors');
    } else {
        console.error('clearAllBuyingBehaviors element not found!');
    }
    if (buyingBehaviorsSearch) {
        buyingBehaviorsSearch.addEventListener('input', (e) => filterBuyingBehaviorsModal(e.target.value));
        console.log('Added input listener to buyingBehaviorsSearch');
    } else {
        console.error('buyingBehaviorsSearch element not found!');
    }
    
    populateBuyingBehaviors();
}

// Product categories modal functionality
function setupProductCategoriesModal() {
    console.log('Setting up product categories modal...');
    console.log('openProductCategoriesModal:', openProductCategoriesModal);
    console.log('closeProductCategoriesModal:', closeProductCategoriesModal);
    console.log('applyProductCategories:', applyProductCategories);
    console.log('clearAllProductCategories:', clearAllProductCategories);
    console.log('productCategoriesSearch:', productCategoriesSearch);
    
    if (openProductCategoriesModal) {
        openProductCategoriesModal.addEventListener('click', showProductCategoriesModal);
        console.log('Added click listener to openProductCategoriesModal');
    } else {
        console.error('openProductCategoriesModal element not found!');
    }
    if (closeProductCategoriesModal) {
        closeProductCategoriesModal.addEventListener('click', hideProductCategoriesModal);
        console.log('Added click listener to closeProductCategoriesModal');
    } else {
        console.error('closeProductCategoriesModal element not found!');
    }
    if (applyProductCategories) {
        applyProductCategories.addEventListener('click', applyProductCategoriesSelection);
        console.log('Added click listener to applyProductCategories');
    } else {
        console.error('applyProductCategories element not found!');
    }
    if (clearAllProductCategories) {
        clearAllProductCategories.addEventListener('click', clearAllProductCategoriesSelections);
        console.log('Added click listener to clearAllProductCategories');
    } else {
        console.error('clearAllProductCategories element not found!');
    }
    if (productCategoriesSearch) {
        productCategoriesSearch.addEventListener('input', (e) => filterProductCategoriesModal(e.target.value));
        console.log('Added input listener to productCategoriesSearch');
    } else {
        console.error('productCategoriesSearch element not found!');
    }
    
    populateProductCategories();
}

function populateBuyingBehaviors() {
    if (!buyingBehaviorsList) return;
    
    const translations = CONFIG.TRANSLATIONS[currentLanguage] || CONFIG.TRANSLATIONS.en;
    
    // Add "Any" option first
    buyingBehaviorsList.innerHTML = `
        <div class="category-checkbox" data-category="Any">
            <input type="checkbox" id="buying-behaviors-any" data-category="Any">
            <label for="buying-behaviors-any">Any</label>
        </div>
    `;
    
    // Add all buying behaviors
    CONFIG.BUYING_BEHAVIORS.forEach(behavior => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'category-checkbox';
        checkboxDiv.setAttribute('data-category', behavior.label);
        
        checkboxDiv.innerHTML = `
            <input type="checkbox" id="buying-behaviors-${behavior.value}" data-category="${behavior.label}">
            <label for="buying-behaviors-${behavior.value}">${behavior.label}</label>
        `;
        
        buyingBehaviorsList.appendChild(checkboxDiv);
    });
    
    setupCheckboxInteractions(buyingBehaviorsList);
}

function populateProductCategories() {
    if (!productCategoriesList) return;
    
    const translations = CONFIG.TRANSLATIONS[currentLanguage] || CONFIG.TRANSLATIONS.en;
    
    // Add "Any" option first
    productCategoriesList.innerHTML = `
        <div class="category-checkbox" data-category="Any">
            <input type="checkbox" id="product-categories-any" data-category="Any">
            <label for="product-categories-any">Any</label>
        </div>
    `;
    
    // Add all product categories
    CONFIG.PRODUCT_CATEGORIES.forEach(category => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'category-checkbox';
        checkboxDiv.setAttribute('data-category', category.label);
        
        checkboxDiv.innerHTML = `
            <input type="checkbox" id="product-categories-${category.value}" data-category="${category.label}">
            <label for="product-categories-${category.value}">${category.label}</label>
        `;
        
        productCategoriesList.appendChild(checkboxDiv);
    });
    
    setupCheckboxInteractions(productCategoriesList);
}

function switchToTab(groupName) {
    if (!categoryList || !categoryTabs) return;
    
    // Update tab buttons
    const tabs = categoryTabs.querySelectorAll('.category-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = categoryTabs.querySelector(`[onclick*="${groupName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Populate categories based on group
    categoryList.innerHTML = '';
    
    let categories = [];
    if (groupName === 'buying_behaviors') {
        categories = CONFIG.BUYING_BEHAVIORS;
    } else if (groupName === 'product_categories') {
        categories = CONFIG.PRODUCT_CATEGORIES;
    }
    
    categories.forEach(category => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'category-checkbox';
        checkboxDiv.setAttribute('data-category', category.label);
        
        checkboxDiv.innerHTML = `
            <input type="checkbox" id="cat-${category.value}" data-category="${category.label}">
            <label for="cat-${category.value}">${category.label}</label>
        `;
        
        categoryList.appendChild(checkboxDiv);
    });
    
    // Setup checkbox interactions
    setupCheckboxInteractions(categoryList);
}

function setupCheckboxInteractions(list) {
    const checkboxes = list.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateModalSelections);
    });
}

function updateModalSelections() {
    const checkboxes = categoryList.querySelectorAll('input[type="checkbox"]:checked');
    const selectedItems = Array.from(checkboxes).map(cb => cb.getAttribute('data-category'));
    
    // Update count display
    if (categoryCount) {
        categoryCount.textContent = `${selectedItems.length} selected`;
        categoryCount.style.display = selectedItems.length > 0 ? 'inline' : 'none';
    }
}

function applyBuyingBehaviorsSelection() {
    const checkboxes = buyingBehaviorsList.querySelectorAll('input[type="checkbox"]:checked');
    const selectedItems = Array.from(checkboxes).map(cb => cb.getAttribute('data-category'));
    
    // Store selected buying behaviors globally
    window.selectedBuyingBehaviors = selectedItems;
    
    // Update button text
    updateBuyingBehaviorsButtonText(selectedItems);
    
    // Update hidden input
    const buyingBehaviorsHidden = document.getElementById('buyingBehaviors');
    if (buyingBehaviorsHidden) {
        buyingBehaviorsHidden.value = selectedItems.join(', ');
    }
    
    // Update chips display
    updateAllSelectedChips();
    
    // Hide modal
    hideBuyingBehaviorsModal();
}

function updateBuyingBehaviorsButtonText(selectedItems) {
    if (buyingBehaviorsButtonText && buyingBehaviorsCount) {
        if (selectedItems.length === 0) {
            buyingBehaviorsButtonText.textContent = 'Select Buying Behaviors';
            buyingBehaviorsCount.style.display = 'none';
        } else if (selectedItems.length === 1) {
            buyingBehaviorsButtonText.textContent = selectedItems[0];
            buyingBehaviorsCount.style.display = 'none';
        } else {
            buyingBehaviorsButtonText.textContent = 'Buying Behaviors';
            buyingBehaviorsCount.textContent = `${selectedItems.length} selected`;
            buyingBehaviorsCount.style.display = 'inline';
        }
    }
}

function applyProductCategoriesSelection() {
    const checkboxes = productCategoriesList.querySelectorAll('input[type="checkbox"]:checked');
    const selectedItems = Array.from(checkboxes).map(cb => cb.getAttribute('data-category'));
    
    // Store selected product categories globally
    window.selectedProductCategories = selectedItems;
    
    // Update button text
    updateProductCategoriesButtonText(selectedItems);
    
    // Update hidden input
    const productCategoriesHidden = document.getElementById('productCategories');
    if (productCategoriesHidden) {
        productCategoriesHidden.value = selectedItems.join(', ');
    }
    
    // Update chips display
    updateAllSelectedChips();
    
    // Hide modal
    hideProductCategoriesModal();
}

function updateProductCategoriesButtonText(selectedItems) {
    if (productCategoriesButtonText && productCategoriesCount) {
        if (selectedItems.length === 0) {
            productCategoriesButtonText.textContent = 'Select Product Categories';
            productCategoriesCount.style.display = 'none';
        } else if (selectedItems.length === 1) {
            productCategoriesButtonText.textContent = selectedItems[0];
            productCategoriesCount.style.display = 'none';
        } else {
            productCategoriesButtonText.textContent = 'Product Categories';
            productCategoriesCount.textContent = `${selectedItems.length} selected`;
            productCategoriesCount.style.display = 'inline';
        }
    }
}

function updateAllSelectedChips() {
    const selectedChipsContainer = document.getElementById('selectedChips');
    if (!selectedChipsContainer) return;
    
    selectedChipsContainer.innerHTML = '';
    
    // Define all selection types and their display names
    const selectionTypes = [
        { key: 'selectedBuyingBehaviors', label: 'Buying Behaviors', icon: 'fas fa-shopping-cart' },
        { key: 'selectedProductCategories', label: 'Product Categories', icon: 'fas fa-tags' },
        { key: 'selectedGenders', label: 'Gender', icon: 'fas fa-venus-mars' },
        { key: 'selectedAges', label: 'Age', icon: 'fas fa-birthday-cake' },
        { key: 'selectedIncomes', label: 'Income', icon: 'fas fa-dollar-sign' },
        { key: 'selectedMaritals', label: 'Marital', icon: 'fas fa-heart' },
        { key: 'selectedChildrens', label: 'Children', icon: 'fas fa-baby' },
        { key: 'selectedEducations', label: 'Education', icon: 'fas fa-graduation-cap' },
        { key: 'selectedRaces', label: 'Race', icon: 'fas fa-globe-americas' }
    ];
    
    selectionTypes.forEach(type => {
        const selectedItems = window[type.key] || [];
        if (selectedItems.length > 0) {
            selectedItems.forEach(item => {
                const chip = document.createElement('span');
                chip.className = 'selected-category-tag';
                chip.innerHTML = `
                    <i class="${type.icon}"></i>
                    ${item}
                    <button type="button" class="remove-category" onclick="removeSelectionChip('${type.key}', '${item}')">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                selectedChipsContainer.appendChild(chip);
            });
        }
    });
}

function removeSelectionChip(selectionKey, item) {
    // Remove from global storage
    if (window[selectionKey]) {
        window[selectionKey] = window[selectionKey].filter(selected => selected !== item);
    }
    
    // Update button text and hidden input
    const type = selectionKey.replace('selected', '').toLowerCase();
    updateSelectionButton(type, window[selectionKey] || []);
    
    // Update hidden input
    const hiddenId = type === 'marital' ? 'maritalStatus' : type === 'children' ? 'hasChildren' : type;
    const hidden = document.getElementById(hiddenId);
    if (hidden) {
        hidden.value = (window[selectionKey] || []).join(', ');
    }
    
    // Special handling for buying behaviors
    if (selectionKey === 'selectedBuyingBehaviors') {
        updateBuyingBehaviorsButtonText(window.selectedBuyingBehaviors || []);
        const buyingBehaviorsHidden = document.getElementById('buyingBehaviors');
        if (buyingBehaviorsHidden) {
            buyingBehaviorsHidden.value = (window.selectedBuyingBehaviors || []).join(', ');
        }
    }
    
    // Special handling for product categories
    if (selectionKey === 'selectedProductCategories') {
        updateProductCategoriesButtonText(window.selectedProductCategories || []);
        const productCategoriesHidden = document.getElementById('productCategories');
        if (productCategoriesHidden) {
            productCategoriesHidden.value = (window.selectedProductCategories || []).join(', ');
        }
    }
    
    // Update chips display
    updateAllSelectedChips();
}





function clearAllBuyingBehaviorsSelections() {
    const checkboxes = buyingBehaviorsList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
}

function clearAllProductCategoriesSelections() {
    const checkboxes = productCategoriesList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
}

function filterBuyingBehaviorsModal(searchTerm) {
    const checkboxes = buyingBehaviorsList.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
        const label = checkbox.querySelector('label').textContent.toLowerCase();
        const matches = label.includes(searchTerm.toLowerCase());
        checkbox.style.display = matches ? 'block' : 'none';
    });
}

function filterProductCategoriesModal(searchTerm) {
    const checkboxes = productCategoriesList.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
        const label = checkbox.querySelector('label').textContent.toLowerCase();
        const matches = label.includes(searchTerm.toLowerCase());
        checkbox.style.display = matches ? 'block' : 'none';
    });
}

function showBuyingBehaviorsModal() {
    console.log('showBuyingBehaviorsModal called');
    console.log('buyingBehaviorsModal:', buyingBehaviorsModal);
    if (buyingBehaviorsModal) {
        buyingBehaviorsModal.style.display = 'flex';
        console.log('Buying behaviors modal shown');
    } else {
        console.error('buyingBehaviorsModal element not found!');
    }
}

function hideBuyingBehaviorsModal() {
    console.log('hideBuyingBehaviorsModal called');
    if (buyingBehaviorsModal) {
        buyingBehaviorsModal.style.display = 'none';
        console.log('Buying behaviors modal hidden');
    } else {
        console.error('buyingBehaviorsModal element not found!');
    }
}

function showProductCategoriesModal() {
    console.log('showProductCategoriesModal called');
    console.log('productCategoriesModal:', productCategoriesModal);
    if (productCategoriesModal) {
        productCategoriesModal.style.display = 'flex';
        console.log('Product categories modal shown');
    } else {
        console.error('productCategoriesModal element not found!');
    }
}

function hideProductCategoriesModal() {
    console.log('hideProductCategoriesModal called');
    if (productCategoriesModal) {
        productCategoriesModal.style.display = 'none';
        console.log('Product categories modal hidden');
    } else {
        console.error('productCategoriesModal element not found!');
    }
}

// Demographic modals setup
function setupDemographicModals() {
    const modalTypes = ['gender', 'age', 'income', 'marital', 'children', 'education', 'race'];
    
    modalTypes.forEach(type => {
        const openBtn = document.getElementById(`open${type.charAt(0).toUpperCase() + type.slice(1)}Modal`);
        const closeBtn = document.getElementById(`close${type.charAt(0).toUpperCase() + type.slice(1)}Modal`);
        
        // Handle special cases for button IDs
        let applyBtn, clearBtn;
        if (type === 'children') {
            applyBtn = document.getElementById('applyChildren');
            clearBtn = document.getElementById('clearAllChildren');
        } else {
            applyBtn = document.getElementById(`apply${type.charAt(0).toUpperCase() + type.slice(1)}s`);
            clearBtn = document.getElementById(`clearAll${type.charAt(0).toUpperCase() + type.slice(1)}s`);
        }
        
        const list = document.getElementById(`${type}List`);
        const buttonText = document.getElementById(`${type}ButtonText`);
        const count = document.getElementById(`${type}Count`);
        const hidden = document.getElementById(type === 'marital' ? 'maritalStatus' : type === 'children' ? 'hasChildren' : type);
        
        // Log missing elements for debugging
        if (!openBtn || !closeBtn || !applyBtn || !list) {
            console.warn(`Missing elements for ${type} modal`);
        }
        
        if (openBtn) openBtn.addEventListener('click', () => showModal(document.getElementById(`${type}Modal`)));
        if (closeBtn) closeBtn.addEventListener('click', () => hideModal(document.getElementById(`${type}Modal`)));
        if (applyBtn) applyBtn.addEventListener('click', () => applySelection(type, list, document.getElementById(`${type}Modal`)));
        if (clearBtn) clearBtn.addEventListener('click', () => clearAllSelections(list));
        
        if (list) {
            setupCheckboxInteractions(list);
        }
    });
}

function showModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideModal(modal) {
    if (modal) {
        modal.style.display = 'none';
    }
}

function applySelection(type, list, modal) {
    const checkboxes = list.querySelectorAll('input[type="checkbox"]:checked');
    const selectedItems = Array.from(checkboxes).map(cb => cb.getAttribute('data-category'));
    
    // Store selected items globally
    window[`selected${type.charAt(0).toUpperCase() + type.slice(1)}s`] = selectedItems;
    
    // Update button text
    updateSelectionButton(type, selectedItems);
    
    // Update hidden input
    const hiddenId = type === 'marital' ? 'maritalStatus' : type === 'children' ? 'hasChildren' : type;
    const hidden = document.getElementById(hiddenId);
    if (hidden) {
        hidden.value = selectedItems.join(', ');
    }
    
    // Update chips display
    updateAllSelectedChips();
    
    // Hide modal
    hideModal(modal);
}

function updateSelectionButton(type, selectedItems) {
    const buttonText = document.getElementById(`${type}ButtonText`);
    const count = document.getElementById(`${type}Count`);
    
    // Keep the original button text
    if (buttonText) {
        const originalTexts = {
            'gender': 'Gender',
            'age': 'Age Range',
            'income': 'Income Range',
            'marital': 'Marital Status',
            'children': 'Children Status',
            'education': 'Education Level',
            'race': 'Race'
        };
        buttonText.textContent = originalTexts[type] || `Select ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    }
    
    if (count) {
        count.textContent = `${selectedItems.length} selected`;
        count.style.display = selectedItems.length > 0 ? 'inline' : 'none';
    }
}

function clearAllSelections(list) {
    const checkboxes = list.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
}

function initializeSelectionButtons() {
    // Initialize all selection buttons with default text
    const buttonTypes = ['category', 'gender', 'age', 'income', 'marital', 'children', 'education', 'race'];
    
    buttonTypes.forEach(type => {
        const buttonText = document.getElementById(`${type}ButtonText`);
        const count = document.getElementById(`${type}Count`);
        
        if (buttonText) {
            const originalTexts = {
                'category': 'Categories',
                'gender': 'Gender',
                'age': 'Age Range',
                'income': 'Income Range',
                'marital': 'Marital Status',
                'children': 'Children Status',
                'education': 'Education Level',
                'race': 'Race'
            };
            buttonText.textContent = originalTexts[type] || `Select ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        }
        
        if (count) {
            count.style.display = 'none';
        }
    });
}

// Slider function removed - using fixed 10 participants

function setupFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const uploadText = this.parentNode.querySelector('.file-upload-text');
            
            if (file) {
                // Show file name and size
                const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
                uploadText.innerHTML = `
                    <i class="fas fa-check-circle" style="color: #28a745;"></i>
                    <div>
                        <strong>${file.name}</strong><br>
                        <small>${fileSize} MB</small>
                    </div>
                `;
                uploadText.style.color = '#28a745';
            } else {
                // Reset to default state
                const isProductImage = this.id === 'productImage';
                const isBrandImage = this.id === 'brandImage';
                const label = isProductImage ? 'product image' : isBrandImage ? 'brand image' : 'image';
                
                uploadText.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    Click to upload ${label} or drag and drop
                `;
                uploadText.style.color = '';
            }
        });
    });
}

function initializeLanguage() {
    if (languageSelect) {
        languageSelect.addEventListener('change', handleLanguageChange);
        // Force English as default if no language is selected or if it's not a valid option
        const selectedValue = languageSelect.value;
        if (!selectedValue || !CONFIG.TRANSLATIONS[selectedValue]) {
            currentLanguage = 'en';
            languageSelect.value = 'en';
        } else {
            currentLanguage = selectedValue;
        }
        updateLanguage();
    }
}

function handleLanguageChange() {
    currentLanguage = languageSelect.value;
    updateLanguage();
}

function updateLanguage() {
    const translations = CONFIG.TRANSLATIONS[currentLanguage] || CONFIG.TRANSLATIONS.en;
    updateFormTexts(translations);
    updateButtonTexts(translations);
    populateDropdowns(); // Repopulate dropdowns with new language
}

function forceEnglishMode() {
    // Force everything to English mode
    currentLanguage = 'en';
    if (languageSelect) {
        languageSelect.value = 'en';
    }
    const translations = CONFIG.TRANSLATIONS.en;
    updateFormTexts(translations);
    updateButtonTexts(translations);
    populateDropdowns();
    updateModalContent(translations);
    updateDemographicOptions(translations);
}

function updateFormTexts(translations) {
    // Update form labels
    const labelMappings = {
        'sessionType': translations.sessionType,
        'sessionName': translations.sessionName,
        'numberOfParticipants': translations.numberOfParticipants,
        'productName': translations.productName,
        'productDescription': translations.productDescription,
        'productImage': translations.productImage,
        'marketName': translations.marketName,
        'marketDescription': translations.marketDescription,
        'brandName': translations.brandName,
        'brandDescription': translations.brandDescription,
        'brandImage': translations.brandImage,
        'userEmail': translations.emailAddress
    };
    
    // Update labels by for attribute
    Object.entries(labelMappings).forEach(([id, text]) => {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
            // Preserve character count spans
            const charCountSpan = label.querySelector('.char-count');
            if (charCountSpan) {
                label.innerHTML = text + ' ' + charCountSpan.outerHTML;
            } else {
                label.textContent = text;
            }
        }
    });
    
    // Update placeholders
    const placeholderMappings = {
        'sessionName': translations.enterSessionName,
        'productName': translations.enterProductName,
        'productDescription': translations.describeProduct,
        'marketName': translations.enterMarketName,
        'marketDescription': translations.describeMarket,
        'brandName': translations.enterBrandName,
        'brandDescription': translations.describeBrand,
        'userEmail': translations.enterEmail
    };
    
    Object.entries(placeholderMappings).forEach(([id, placeholder]) => {
        const element = document.getElementById(id);
        if (element) {
            element.placeholder = placeholder;
        }
    });
    
    // Update question input placeholders
    const questionInputs = document.querySelectorAll('.question-input');
    questionInputs.forEach(input => {
        // Always update the placeholder regardless of current content
        input.placeholder = translations.enterQuestion + ' ' + (input.placeholder.match(/\d+/) || ['1'])[0] + '...';
    });
    
    // Find and update questions labels
    const allLabels = document.querySelectorAll('label');
    allLabels.forEach(label => {
        if (label.textContent.includes('Questions') || label.textContent.includes('问题') || label.textContent.includes('問題')) {
            label.textContent = translations.questions;
        }
    });
    
    // Update success modal texts
    const successTitle = document.querySelector('#successModal h2');
    if (successTitle) {
        successTitle.textContent = translations.successTitle;
    }
    
    const successMessage = document.querySelector('#successModal .success-message p');
    if (successMessage) {
        successMessage.textContent = translations.successMessage;
    }
    
    const emailNotice = document.querySelector('#successModal .email-notice p');
    if (emailNotice) {
        emailNotice.textContent = translations.emailNotice;
    }
    
    const processingInfo = document.querySelector('#successModal .processing-info p');
    if (processingInfo) {
        processingInfo.textContent = translations.processingInfo;
    }
    
    const gotItButton = document.querySelector('#closeSuccessModalBtn');
    if (gotItButton) {
        gotItButton.textContent = translations.gotIt;
    }
    
    // Update demographic options
    updateDemographicOptions(translations);
    
    // Update modal content
    updateModalContent(translations);
}

function updateDemographicOptions(translations) {
    // Update "Any" labels in all demographic modals
    const anyLabels = document.querySelectorAll('label[for*="-any"]');
    anyLabels.forEach(label => {
        if (label.textContent === 'Any' || label.textContent === '任何') {
            label.textContent = translations.any;
        }
    });
    
    // Update gender options
    const maleLabel = document.querySelector('label[for="gender-male"]');
    if (maleLabel) {
        maleLabel.textContent = translations.male;
    }
    
    const femaleLabel = document.querySelector('label[for="gender-female"]');
    if (femaleLabel) {
        femaleLabel.textContent = translations.female;
    }
    
    // Update all demographic labels comprehensively
    const demographicMappings = {
        // English to translations
        'Any': translations.any,
        'Male': translations.male,
        'Female': translations.female,
        // Chinese to translations (for reverting back)
        '任何': translations.any,
        '男性': translations.male,
        '女性': translations.female
    };
    
    // Update all demographic labels
    const allDemographicLabels = document.querySelectorAll('.category-checkbox label');
    allDemographicLabels.forEach(label => {
        const currentText = label.textContent;
        if (demographicMappings[currentText]) {
            label.textContent = demographicMappings[currentText];
        }
    });
}

function updateModalContent(translations) {
    // Update modal titles
    const modalTitles = document.querySelectorAll('h3');
    modalTitles.forEach(title => {
        if (title.textContent === 'Select Participant Categories' || 
            title.textContent === '选择参与者类别' || 
            title.textContent === '選擇參與者類別') {
            title.textContent = translations.selectParticipantCategories;
        }
    });
    
    // Update search placeholders
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"], input[placeholder*="搜索"]');
    searchInputs.forEach(input => {
        if (input.placeholder.includes('Search categories') || 
            input.placeholder.includes('搜索类别') || 
            input.placeholder.includes('搜索類別')) {
            input.placeholder = translations.searchCategories;
        }
    });
    
    // Update Clear All buttons
    const clearAllButtons = document.querySelectorAll('button[id*="clearAll"]');
    clearAllButtons.forEach(button => {
        const icon = button.querySelector('i');
        if (icon && (button.textContent.includes('Clear All') || 
                     button.textContent.includes('清除全部'))) {
            button.innerHTML = `<i class="${icon.className}"></i> ${translations.clearAll}`;
        }
    });
    
    // Update Apply Selection buttons
    const applyButtons = document.querySelectorAll('button[id*="apply"]');
    applyButtons.forEach(button => {
        const icon = button.querySelector('i');
        if (icon && (button.textContent.includes('Apply Selection') || 
                     button.textContent.includes('应用选择') || 
                     button.textContent.includes('應用選擇'))) {
            button.innerHTML = `<i class="${icon.className}"></i> ${translations.applySelection}`;
        }
    });
    
    // Update category labels
    updateCategoryLabels(translations);
}

function updateCategoryLabels(translations) {
    // Update buying behavior category labels with comprehensive mapping
    const categoryMappings = {
        // English to translations
        'General': translations.general,
        'Online': translations.online,
        'Budget-Conscious': translations.budgetConscious,
        'Luxury': translations.luxury,
        'Eco-Conscious': translations.ecoConscious,
        'Impulse Buyer': translations.impulseBuyer,
        'Research Heavy': translations.researchHeavy,
        'Brand Loyal': translations.brandLoyal,
        'Deal Seekers': translations.dealSeekers,
        // Chinese to translations (for reverting back)
        '通用': translations.general,
        '在线': translations.online,
        '在線': translations.online,
        '预算意识': translations.budgetConscious,
        '預算意識': translations.budgetConscious,
        '奢侈品': translations.luxury,
        '环保意识': translations.ecoConscious,
        '環保意識': translations.ecoConscious,
        '冲动购买': translations.impulseBuyer,
        '衝動購買': translations.impulseBuyer,
        '重度研究': translations.researchHeavy,
        '品牌忠诚': translations.brandLoyal,
        '品牌忠誠': translations.brandLoyal,
        '优惠寻求者': translations.dealSeekers,
        '優惠尋求者': translations.dealSeekers
    };
    
    // Update all category labels in modals
    const categoryLabels = document.querySelectorAll('.category-checkbox label');
    categoryLabels.forEach(label => {
        const currentText = label.textContent;
        if (categoryMappings[currentText]) {
            label.textContent = categoryMappings[currentText];
        }
    });
}

function updateButtonTexts(translations) {
    // Update button texts
    const buttonMappings = {
        'startFocusGroupBtn': translations.startFocusGroup,
        'logoutBtn': translations.logout,
        'categoryButtonText': translations.selectCategories,
        'genderButtonText': translations.selectGender,
        'ageButtonText': translations.selectAgeRange,
        'incomeButtonText': translations.selectIncomeRange,
        'maritalButtonText': translations.selectMaritalStatus,
        'childrenButtonText': translations.selectChildrenStatus,
        'educationButtonText': translations.selectEducationLevel,
        'raceButtonText': translations.selectRace
    };
    
    Object.entries(buttonMappings).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    });
    
    // Update modal tab titles
    const buyingBehaviorsTab = document.querySelector('.category-tab[onclick*="buying_behaviors"]');
    if (buyingBehaviorsTab) {
        buyingBehaviorsTab.innerHTML = `<i class="fas fa-shopping-cart"></i> ${translations.buyingBehaviors}`;
    }
    
    const productCategoriesTab = document.querySelector('.category-tab[onclick*="product_categories"]');
    if (productCategoriesTab) {
        productCategoriesTab.innerHTML = `<i class="fas fa-tags"></i> ${translations.productCategories}`;
    }
}