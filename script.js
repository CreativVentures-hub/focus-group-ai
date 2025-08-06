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
    console.log('Webhook URL:', CONFIG.WEBHOOK_URL);
    
    // Validate webhook data before sending
    const validationResult = validateWebhookData(webhookData);
    if (!validationResult.isValid) {
        showFormError(focusGroupForm, validationResult.message);
        return;
    }
    
    // Log the JSON string being sent
    const jsonData = JSON.stringify(webhookData, null, 2);
    console.log('JSON data being sent:', jsonData);
    console.log('Data size:', jsonData.length, 'characters');
    
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
            // Try to get more detailed error information
            let errorMessage = `Server Error: ${response.status} ${response.statusText}`;
            
            try {
                const errorData = await response.text();
                console.log('Error response body:', errorData);
                
                if (errorData) {
                    if (errorData.includes('html') || errorData.includes('<!DOCTYPE')) {
                        errorMessage = `Server Error (${response.status}): The n8n workflow may be experiencing issues. Please try again in a few minutes.`;
                    } else {
                        errorMessage = `Server Error (${response.status}): ${errorData.substring(0, 200)}...`;
                    }
                }
            } catch (textError) {
                console.error('Could not read error response:', textError);
            }
            
            showFormError(focusGroupForm, errorMessage);
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

// Session types and categories management
function populateDropdowns() {
    console.log('Populating dropdowns...');
    
    // Populate session types
    if (sessionTypeSelect) {
        sessionTypeSelect.innerHTML = '<option value="">Select session type</option>';
        
        CONFIG.SESSION_TYPES.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.label;
            if (type.disabled) {
                option.disabled = true;
                option.textContent += ' (Coming Soon)';
            }
            sessionTypeSelect.appendChild(option);
        });
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
    console.log('Initializing questions for:', containerId);
    
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
    
    questionItem.innerHTML = `
        <div class="question-number">${questionNumber}</div>
        <input type="text" class="question-input" placeholder="Enter question ${questionNumber}..." value="${questionText}" maxlength="500">
    `;
    
    container.appendChild(questionItem);
}

function removeQuestion(button) {
    const questionItem = button.parentElement;
    const container = questionItem.parentElement;
    
    questionItem.remove();
    
    // Renumber remaining questions
    const questions = container.querySelectorAll('.question-item');
    questions.forEach((item, index) => {
        const numberDiv = item.querySelector('.question-number');
        if (numberDiv) {
            numberDiv.textContent = index + 1;
        }
    });
}

function setupCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[maxlength]');
    textareas.forEach(textarea => {
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
    
    categoryTabs.innerHTML = `
        <button class="category-tab active" onclick="switchToTab('buying_behaviors')">
            <i class="fas fa-shopping-cart"></i> Buying Behaviors
        </button>
        <button class="category-tab" onclick="switchToTab('product_categories')">
            <i class="fas fa-tags"></i> Product Categories
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
    
    // Update selected chips display
    updateSelectedCategoriesDisplay();
    
    // Hide modal
    hideCategoryModal();
}

function updateCategoryButtonText(selectedItems) {
    if (categoryButtonText) {
        if (selectedItems.length === 0) {
            categoryButtonText.textContent = 'Select Categories';
        } else if (selectedItems.length === 1) {
            categoryButtonText.textContent = selectedItems[0];
        } else {
            categoryButtonText.textContent = `${selectedItems.length} Categories Selected`;
        }
    }
}

function updateSelectedCategoriesDisplay() {
    if (!selectedCategoriesContainer) return;
    
    selectedCategoriesContainer.innerHTML = '';
    
    const selectedItems = window.selectedCategories || [];
    selectedItems.forEach(item => {
        const chip = document.createElement('span');
        chip.className = 'selected-category-tag';
        chip.innerHTML = `
            ${item}
            <button type="button" class="remove-category" onclick="removeCategory('${item}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        selectedCategoriesContainer.appendChild(chip);
    });
}

function removeCategory(category) {
    window.selectedCategories = window.selectedCategories.filter(cat => cat !== category);
    updateCategoryButtonText(window.selectedCategories);
    updateSelectedCategoriesDisplay();
    
    // Uncheck in modal
    const checkbox = categoryList.querySelector(`input[data-category="${category}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
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
        const applyBtn = document.getElementById(`apply${type.charAt(0).toUpperCase() + type.slice(1)}s`);
        const clearBtn = document.getElementById(`clearAll${type.charAt(0).toUpperCase() + type.slice(1)}s`);
        const list = document.getElementById(`${type}List`);
        const buttonText = document.getElementById(`${type}ButtonText`);
        const count = document.getElementById(`${type}Count`);
        const hidden = document.getElementById(type === 'marital' ? 'maritalStatus' : type === 'children' ? 'hasChildren' : type);
        
        console.log(`Setting up ${type} modal:`, {
            openBtn: !!openBtn,
            closeBtn: !!closeBtn,
            applyBtn: !!applyBtn,
            clearBtn: !!clearBtn,
            list: !!list,
            buttonText: !!buttonText,
            count: !!count,
            hidden: !!hidden
        });
        
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
    
    // Hide modal
    hideModal(modal);
}

function updateSelectionButton(type, selectedItems) {
    const buttonText = document.getElementById(`${type}ButtonText`);
    const count = document.getElementById(`${type}Count`);
    
    if (buttonText) {
        if (selectedItems.length === 0) {
            buttonText.textContent = `Select ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        } else if (selectedItems.length === 1) {
            buttonText.textContent = selectedItems[0];
        } else {
            buttonText.textContent = `${selectedItems.length} Selected`;
        }
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
            buttonText.textContent = `Select ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        }
        
        if (count) {
            count.style.display = 'none';
        }
    });
}

function initializeSlider() {
    if (numberOfParticipantsSlider && numberOfParticipantsValue) {
        numberOfParticipantsSlider.addEventListener('input', function() {
            numberOfParticipantsValue.textContent = this.value;
        });
        
        // Set initial value
        numberOfParticipantsValue.textContent = numberOfParticipantsSlider.value;
    }
}

function initializeLanguage() {
    if (languageSelect) {
        languageSelect.addEventListener('change', handleLanguageChange);
        currentLanguage = languageSelect.value || 'en';
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
}

function updateFormTexts(translations) {
    // Update form labels and placeholders
    const elements = {
        'sessionType': translations.sessionType,
        'sessionName': translations.sessionName,
        'numberOfParticipants': translations.numberOfParticipants,
        'userEmail': translations.userEmail
    };
    
    Object.entries(elements).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });
}

function updateButtonTexts(translations) {
    // Update button texts
    const buttons = {
        'startFocusGroup': translations.startFocusGroup,
        'login': translations.login,
        'logout': translations.logout
    };
    
    Object.entries(buttons).forEach(([key, text]) => {
        const button = document.querySelector(`[data-translate="${key}"]`);
        if (button) {
            button.textContent = text;
        }
    });
}

function showGitHubPagesNotice() {
    // Show notice about GitHub Pages limitations
    const notice = document.createElement('div');
    notice.className = 'notice-banner';
    notice.innerHTML = `
        <div class="notice-content">
            <i class="fas fa-info-circle"></i>
            <span>This is a live demo. For full functionality, download and run locally.</span>
            <button class="notice-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.insertBefore(notice, document.body.firstChild);
}








