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
let categorySearch, categoryTabs, categoryList, categoryHidden, selectedCategoriesContainer;
let categoryModal, openCategoryModal, closeCategoryModal, applyCategories, clearAllCategories;
let categoryButtonText, categoryCount, numberOfParticipantsSlider, numberOfParticipantsValue;
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
    setupCategoryModal();
    
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
        
        // Initialize slider after login since the main section is now visible
        initializeSlider();
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
            initializeQuestions('productQuestions', 10);
            break;
        case 'market_research':
            const marketFields = document.getElementById('marketResearchFields');
            if (marketFields) marketFields.style.display = 'block';
            initializeQuestions('marketQuestions', 10);
            break;
        case 'brand_perception':
            const brandFields = document.getElementById('brandPerceptionFields');
            if (brandFields) brandFields.style.display = 'block';
            initializeQuestions('brandQuestions', 10);
            break;
    }
    
    // Setup character counters once after showing fields
    setupCharacterCounters();
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
    return window.selectedCategories || [];
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
    
    // Check categories
    if (!data.categories || data.categories.length === 0) {
        errors.push('Please select at least one participant category');
    }
    
    // Check session-specific data
    if (data.session_type === 'market_research') {
        if (!data.market_name) errors.push('Market name is required');
        if (!data.market_description) errors.push('Market description is required');
        if (!data.questions || data.questions.length === 0) errors.push('At least one question is required');
    } else if (data.session_type === 'product_research') {
        if (!data.product_name) errors.push('Product name is required');
        if (!data.product_description) errors.push('Product description is required');
        if (!data.questions || data.questions.length === 0) errors.push('At least one question is required');
    } else if (data.session_type === 'brand_perception') {
        if (!data.brand_name) errors.push('Brand name is required');
        if (!data.brand_description) errors.push('Brand description is required');
        if (!data.questions || data.questions.length === 0) errors.push('At least one question is required');
    }
    
    // Check questions
    if (data.questions) {
        const validQuestions = data.questions.filter(q => q.text && q.text.trim().length > 0);
        if (validQuestions.length === 0) {
            errors.push('Please enter at least one question');
        }
    }
    
    if (errors.length > 0) {
        return {
            isValid: false,
            message: 'Please fix the following errors:\n• ' + errors.join('\n• ')
        };
    }
    
    return { isValid: true };
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
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear existing questions
    container.innerHTML = '';
    
    // Add exactly 10 questions without add/remove functionality
    for (let i = 1; i <= 10; i++) {
        addQuestion(container, i);
    }
}

function addQuestion(container, questionNumber, questionText = '') {
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item';
    
    const translations = CONFIG.TRANSLATIONS[currentLanguage] || CONFIG.TRANSLATIONS.en;
    
    questionItem.innerHTML = `
        <div class="question-number">${questionNumber}</div>
        <input type="text" class="question-input" placeholder="${translations.enterQuestion} ${questionNumber}..." value="${questionText}" maxlength="500">
    `;
    
    container.appendChild(questionItem);
}



function setupCharacterCounters() {
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

// Category modal functionality
function setupCategoryModal() {
    if (openCategoryModal) {
        openCategoryModal.addEventListener('click', showCategoryModal);
    }
    if (closeCategoryModal) {
        closeCategoryModal.addEventListener('click', hideCategoryModal);
    }
    if (applyCategories) {
        applyCategories.addEventListener('click', applyCategorySelection);
    }
    if (clearAllCategories) {
        clearAllCategories.addEventListener('click', clearAllCategorySelections);
    }
    if (categorySearch) {
        categorySearch.addEventListener('input', (e) => filterCategoryModal(e.target.value));
    }
    
    populateCategoryTabs();
    populateCategoryGroups();
}

function populateCategoryTabs() {
    if (!categoryTabs) return;
    
    const translations = CONFIG.TRANSLATIONS[currentLanguage] || CONFIG.TRANSLATIONS.en;
    
    categoryTabs.innerHTML = `
        <button class="category-tab active" onclick="switchToTab('buying_behaviors')">
            <i class="fas fa-shopping-cart"></i> ${translations.buyingBehaviors}
        </button>
        <button class="category-tab" onclick="switchToTab('product_categories')">
            <i class="fas fa-tags"></i> ${translations.productCategories}
        </button>
    `;
}

function populateCategoryGroups() {
    if (!categoryList) return;
    
    // Show buying behaviors by default
    switchToTab('buying_behaviors');
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

function applyCategorySelection() {
    const checkboxes = categoryList.querySelectorAll('input[type="checkbox"]:checked');
    const selectedItems = Array.from(checkboxes).map(cb => cb.getAttribute('data-category'));
    
    // Store selected categories globally
    window.selectedCategories = selectedItems;
    
    // Update button text
    updateCategoryButtonText(selectedItems);
    
    // Update hidden input
    if (categoryHidden) {
        categoryHidden.value = selectedItems.join(', ');
    }
    
    // Update chips display
    updateAllSelectedChips();
    
    // Hide modal
    hideCategoryModal();
}

function updateCategoryButtonText(selectedItems) {
    if (categoryButtonText) {
        categoryButtonText.textContent = 'Categories';
    }
}

function updateAllSelectedChips() {
    const selectedChipsContainer = document.getElementById('selectedChips');
    if (!selectedChipsContainer) return;
    
    selectedChipsContainer.innerHTML = '';
    
    // Define all selection types and their display names
    const selectionTypes = [
        { key: 'selectedCategories', label: 'Categories', icon: 'fas fa-tags' },
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
    
    // Special handling for categories
    if (selectionKey === 'selectedCategories') {
        updateCategoryButtonText(window.selectedCategories || []);
        if (categoryHidden) {
            categoryHidden.value = (window.selectedCategories || []).join(', ');
        }
    }
    
    // Update chips display
    updateAllSelectedChips();
}





function clearAllCategorySelections() {
    const checkboxes = categoryList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateModalSelections();
}

function filterCategoryModal(searchTerm) {
    const checkboxes = categoryList.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
        const label = checkbox.querySelector('label').textContent.toLowerCase();
        const matches = label.includes(searchTerm.toLowerCase());
        checkbox.style.display = matches ? 'block' : 'none';
    });
}

function showCategoryModal() {
    if (categoryModal) {
        categoryModal.style.display = 'flex';
    }
}

function hideCategoryModal() {
    if (categoryModal) {
        categoryModal.style.display = 'none';
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

function initializeSlider() {
    // Re-get the elements in case they weren't available during initial DOM setup
    const slider = document.getElementById('numberOfParticipants');
    const valueDisplay = document.getElementById('numberOfParticipantsValue');
    
    if (slider && valueDisplay) {
        // Add event listener for slider changes
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
        
        // Set initial value
        valueDisplay.textContent = slider.value;
        
        console.log('Slider initialized successfully');
    } else {
        console.error('Slider elements not found:', { slider: !!slider, valueDisplay: !!valueDisplay });
    }
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