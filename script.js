// Focus Group System JavaScript

// Script loaded successfully

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

// DOM Elements - will be initialized after DOM loads
let loginSection, mainSection, loginForm, passwordInput, loginError, logoutBtn;
let focusGroupForm, sessionTypeSelect;
let categorySearch, categoryTabs, categoryList, categoryHidden, selectedCategoriesContainer;
let categoryModal, openCategoryModal, closeCategoryModal, applyCategories, clearAllCategories;
let categoryButtonText, categoryCount, numberOfParticipantsSlider, numberOfParticipantsValue;

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
    // Don't populate dropdowns yet - wait for login
    
    // Initialize language
    initializeLanguage();
    
    // Show GitHub Pages notice if on GitHub Pages
    if (window.location.hostname.includes('github.io')) {
        showGitHubPagesNotice();
    }
    
    // Auto-refresh for development (only on localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Development mode detected - enabling auto-refresh');
        
        // Check for updates every 30 seconds
        setInterval(() => {
            fetch(window.location.href + '?t=' + Date.now(), { method: 'HEAD' })
                .then(response => {
                    if (response.headers.get('last-modified')) {
                        const lastModified = new Date(response.headers.get('last-modified'));
                        const currentTime = new Date();
                        if (currentTime - lastModified < 60000) { // If file was modified in last minute
                            console.log('Changes detected, refreshing...');
                            window.location.reload();
                        }
                    }
                })
                .catch(() => {
                    // Ignore errors
                });
        }, 30000);
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
    
    // Language element
    languageSelect = document.getElementById('languageSelect');
    
    console.log('DOM elements initialized:', {
        loginSection: !!loginSection,
        mainSection: !!mainSection,
        loginForm: !!loginForm,
        passwordInput: !!passwordInput,
        loginError: !!loginError,
        logoutBtn: !!logoutBtn
    });
}

function initializeApp() {
    // Show login section by default
    showLoginSection();
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    console.log('loginForm element:', loginForm);
    console.log('passwordInput element:', passwordInput);
    
    // Login functionality
    if (loginForm) {
        console.log('Adding login form event listener');
        loginForm.addEventListener('submit', handleLogin);
        
        // Also add click handler to the submit button for testing
        const submitButton = loginForm.querySelector('button[type="submit"]');
        if (submitButton) {
            console.log('Adding submit button click handler');
            submitButton.addEventListener('click', (e) => {
                console.log('Submit button clicked!');
                // Don't prevent default here - let the form submit handle it
            });
        }
    } else {
        console.error('Login form not found!');
    }
    
    // Logout button
    if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Form submissions
    focusGroupForm.addEventListener('submit', handleFocusGroupForm);
    
    // Session type change (for showing/hiding product fields)
    sessionTypeSelect.addEventListener('change', handleSessionTypeChange);
    
    // Category modal events
    setupCategoryModal();
    
    // Setup all demographic modals
    setupDemographicModals();
    
    // Initialize all selection buttons with default text
    initializeSelectionButtons();
    
    // Initialize slider
    initializeSlider();
    

}

function populateDropdowns() {
    if (!CONFIG.SESSION_TYPES) {
        // Fallback session types if config fails to load
        const fallbackSessionTypes = [
            { value: 'market_research', label: 'Market Research' },
            { value: 'product_research', label: 'Product Research' },
            { value: 'user_experience', label: 'User Experience', disabled: true },
            { value: 'customer_feedback', label: 'Customer Feedback', disabled: true },
            { value: 'brand_perception', label: 'Brand Perception' }
        ];
        
        // Clear existing options first
        sessionTypeSelect.innerHTML = '<option value="">Select session type</option>';
        
        // Populate with fallback types
        fallbackSessionTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.label;
            
            // Add disabled attribute if specified
            if (type.disabled) {
                option.disabled = true;
                option.textContent = type.label + ' (Coming Soon)';
            }
            
            sessionTypeSelect.appendChild(option);
        });
        
        sessionTypeSelect.value = 'market_research';
        return;
    }
    
    if (!sessionTypeSelect) {
        return;
    }
    
    // Clear existing options first
    sessionTypeSelect.innerHTML = '<option value="">Select session type</option>';
    
    // Populate session types
    CONFIG.SESSION_TYPES.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.label;
        
        // Add disabled attribute if specified
        if (type.disabled) {
            option.disabled = true;
            option.textContent = type.label + ' (Coming Soon)';
        }
        
        sessionTypeSelect.appendChild(option);
    });
    
    // Set Market Research as default
    sessionTypeSelect.value = 'market_research';
    
    // Trigger session type change to show default fields
    handleSessionTypeChange();
    
    // Populate category modal with categories
    populateCategoryModal();
    
    // Initialize slider tracks
    if (numberOfParticipantsSlider) {
        updateSliderTrack(numberOfParticipantsSlider);
    }
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
        // Store login state in session storage
        sessionStorage.setItem('focusGroupLoggedIn', 'true');
        
        showMainSection();
        
        // Populate dropdowns after successful login
        populateDropdowns();
        
        clearLoginForm();
    } else {
        console.log('Password incorrect!');
        showLoginError();
    }
}

function handleLogout() {
    // Clear session storage
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
    sessionFields.style.display = 'block';
    
    // Show specific fields based on session type
    switch (selectedType) {
        case 'product_research':
            document.getElementById('productResearchFields').style.display = 'block';
            initializeQuestions('productQuestions', 10);
            setupCharacterCounters();
            break;
        case 'market_research':
            document.getElementById('marketResearchFields').style.display = 'block';
            initializeQuestions('marketQuestions', 10);
            setupCharacterCounters();
            break;
        case 'brand_perception':
            document.getElementById('brandPerceptionFields').style.display = 'block';
            initializeQuestions('brandQuestions', 10);
            setupCharacterCounters();
            break;
        default:
            // For now, don't hide session fields - just don't show specific ones
            break;
    }
}

function initializeQuestions(containerId, maxQuestions) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear existing questions
    container.innerHTML = '';
    
    // Get saved questions for this session type
    const sessionType = getSessionTypeFromContainerId(containerId);
    const savedQuestions = getSavedQuestions(sessionType);
    
    if (savedQuestions && savedQuestions.length > 0) {
        // Use saved questions
        savedQuestions.forEach((question, index) => {
            addQuestion(container, index + 1, question.text);
        });
        
        // Add additional empty questions if needed
        for (let i = savedQuestions.length; i < maxQuestions; i++) {
            addQuestion(container, i + 1);
        }
        
        // Show notification that saved questions were loaded
        showSavedQuestionsNotification(sessionType, savedQuestions.length);
    } else {
        // Create initial empty questions
        for (let i = 1; i <= maxQuestions; i++) {
            addQuestion(container, i);
        }
    }
}

function getSessionTypeFromContainerId(containerId) {
    switch (containerId) {
        case 'marketQuestions':
            return 'market_research';
        case 'productQuestions':
            return 'product_research';
        case 'brandQuestions':
            return 'brand_perception';
        default:
            return 'market_research';
    }
}

function getSavedQuestions(sessionType) {
    const saved = localStorage.getItem(`focus_group_questions_${sessionType}`);
    return saved ? JSON.parse(saved) : [];
}

function saveQuestions(sessionType, questions) {
    localStorage.setItem(`focus_group_questions_${sessionType}`, JSON.stringify(questions));
}

function clearSavedQuestions(sessionType) {
    localStorage.removeItem(`focus_group_questions_${sessionType}`);
}

function clearAllSavedQuestions() {
    localStorage.removeItem('focus_group_questions_market_research');
    localStorage.removeItem('focus_group_questions_product_research');
    localStorage.removeItem('focus_group_questions_brand_perception');
}



function showSavedQuestionsNotification(sessionType, questionCount) {
    const sessionTypeLabels = {
        'market_research': 'Market Research',
        'product_research': 'Product Research',
        'brand_perception': 'Brand Perception'
    };
    
    const label = sessionTypeLabels[sessionType] || sessionType;
    
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'saved-questions-notification';
    notification.innerHTML = `
        <i class="fas fa-save"></i>
        Loaded ${questionCount} saved questions from previous ${label} session
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function addQuestion(container, questionNumber, questionText = '') {
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item';
    questionItem.innerHTML = `
        <div class="question-number">${questionNumber}</div>
        <textarea class="question-input" name="question_${questionNumber}" placeholder="Enter question ${questionNumber}..." required>${questionText}</textarea>
        ${questionNumber > 1 ? '<button type="button" class="remove-question-btn" onclick="removeQuestion(this)"><i class="fas fa-times"></i></button>' : ''}
    `;
    container.appendChild(questionItem);
}

function removeQuestion(button) {
    const questionItem = button.parentElement;
    const container = questionItem.parentElement;
    container.removeChild(questionItem);
    
    // Renumber remaining questions
    const questions = container.querySelectorAll('.question-item');
    questions.forEach((item, index) => {
        const numberDiv = item.querySelector('.question-number');
        const textarea = item.querySelector('.question-input');
        const removeBtn = item.querySelector('.remove-question-btn');
        
        numberDiv.textContent = index + 1;
        textarea.name = `question_${index + 1}`;
        textarea.placeholder = `Enter question ${index + 1}...`;
        
        // Show/hide remove button based on question count
        if (removeBtn) {
            if (index === 0) {
                removeBtn.style.display = 'none';
            } else {
                removeBtn.style.display = 'block';
            }
        }
    });
}

function setupCharacterCounters() {
    // Setup character counters for text inputs and textareas
    const charCountElements = document.querySelectorAll('input[maxlength], textarea[maxlength]');
    
    charCountElements.forEach(element => {
        const maxLength = element.getAttribute('maxlength');
        const countId = element.id + 'Count';
        const countElement = document.getElementById(countId);
        
        if (countElement) {
            // Update count on input
            const updateCount = () => {
                const currentLength = element.value.length;
                countElement.textContent = currentLength;
                
                // Update color based on usage
                const percentage = (currentLength / maxLength) * 100;
                if (percentage >= 90) {
                    countElement.className = 'char-count error';
                } else if (percentage >= 75) {
                    countElement.className = 'char-count warning';
                } else {
                    countElement.className = 'char-count';
                }
            };
            
            element.addEventListener('input', updateCount);
            updateCount(); // Initial count
        }
    });
}

function collectQuestions(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    
    const questions = [];
    const questionInputs = container.querySelectorAll('.question-input');
    
    questionInputs.forEach((input, index) => {
        const questionText = input.value.trim();
        if (questionText) {
            questions.push({
                number: index + 1,
                text: questionText
            });
        }
    });
    
    return questions;
}

function validateAgeRange() {
    const minAge = parseInt(document.getElementById('minAge').value);
    const maxAge = parseInt(document.getElementById('maxAge').value);
    
    if (minAge > maxAge) {
        document.getElementById('maxAge').setCustomValidity('Maximum age must be greater than minimum age');
    } else {
        document.getElementById('maxAge').setCustomValidity('');
    }
}

function validateIncomeRange() {
    const minIncome = parseInt(document.getElementById('minIncome').value);
    const maxIncome = parseInt(document.getElementById('maxIncome').value);
    
    if (minIncome > maxIncome) {
        document.getElementById('maxIncome').setCustomValidity('Maximum income must be greater than minimum income');
    } else {
        document.getElementById('maxIncome').setCustomValidity('');
    }
}

function getSelectedCategories() {
    return window.selectedCategories || [];
}

function validateWebhookData(data) {
    const errors = [];
    
    // Validate categories
    if (!Array.isArray(data.categories) || data.categories.length === 0) {
        errors.push('At least one category must be selected');
    }
    
    // Validate gender
    const validGenders = ['Any', 'Male', 'Female'];
    if (!validGenders.includes(data.gender)) {
        errors.push(`Invalid gender: ${data.gender}. Must be one of: ${validGenders.join(', ')}`);
    }
    
    // Validate marital status
    const validMaritalStatuses = ['Any', 'Single', 'Married', 'Divorced', 'Widowed', 'Partnered'];
    if (!validMaritalStatuses.includes(data.maritalStatus)) {
        errors.push(`Invalid marital status: ${data.maritalStatus}. Must be one of: ${validMaritalStatuses.join(', ')}`);
    }
    
    // Validate has children
    const validHasChildren = ['Any', 'Yes', 'No'];
    if (!validHasChildren.includes(data.hasChildren)) {
        errors.push(`Invalid has children: ${data.hasChildren}. Must be one of: ${validHasChildren.join(', ')}`);
    }
    
    // Validate numbers
    if (isNaN(data.numberOfParticipants) || data.numberOfParticipants < 6 || data.numberOfParticipants > 20) {
        errors.push('Number of participants must be between 6 and 20');
    }
    
    if (isNaN(data.minAge) || data.minAge < 18 || data.minAge > 100) {
        errors.push('Minimum age must be between 18 and 100');
    }
    
    if (isNaN(data.maxAge) || data.maxAge < 18 || data.maxAge > 100) {
        errors.push('Maximum age must be between 18 and 100');
    }
    
    if (data.minAge > data.maxAge) {
        errors.push('Minimum age cannot be greater than maximum age');
    }
    
    if (isNaN(data.minIncome) || data.minIncome < 20000 || data.minIncome > 250000) {
        errors.push('Minimum income must be between $20,000 and $250,000');
    }
    
    if (isNaN(data.maxIncome) || data.maxIncome < 20000 || data.maxIncome > 250000) {
        errors.push('Maximum income must be between $20,000 and $250,000');
    }
    
    if (data.minIncome > data.maxIncome) {
        errors.push('Minimum income cannot be greater than maximum income');
    }
    
    return errors;
}

// Category-specific loading messages system
function getCategorySpecificMessages(selectedCategories) {
    const baseMessages = [
        "<i class='fas fa-theater-masks'></i> Assembling your focus group cast with the precision of a Broadway director. We're carefully selecting each participant based on your specific criteria, ensuring a perfect blend of personalities, backgrounds, and perspectives. This isn't just random selection - it's strategic casting for maximum insight potential...",
        "<i class='fas fa-chart-bar'></i> Making sure they're statistically diverse and demographically balanced. We're analyzing age distributions, income ranges, geographic locations, and lifestyle factors to create a representative sample that will give you the most accurate insights. Each participant is being evaluated against multiple criteria to ensure optimal group dynamics...",
        "<i class='fas fa-paint-brush'></i> Adding quirky personality traits and unique characteristics that will make your focus group sessions truly memorable. We're programming each participant with distinct mannerisms, communication styles, and behavioral patterns that will create engaging discussions and reveal unexpected insights. These aren't cookie-cutter participants - they're individuals with depth and complexity...",
        "<i class='fas fa-brain'></i> Programming their knowledge bases and expertise levels to match your research requirements. We're carefully calibrating each participant's familiarity with your product category, their shopping habits, and their decision-making processes. This ensures that discussions will be both informed and authentic, providing you with actionable insights...",
        "<i class='fas fa-users'></i> Creating realistic social dynamics and group interaction patterns. We're designing how participants will interact with each other, including natural conversation flows, potential conflicts, and collaborative moments. This includes everything from who will be the natural leaders to who will need encouragement to speak up...",
        "<i class='fas fa-home'></i> Finding them suitable homes across America with realistic living situations. We're placing each participant in appropriate housing scenarios that match their demographic profile - from urban apartments to suburban homes to rural properties. Each location is carefully chosen to reflect real-world diversity and provide authentic context for their shopping behaviors...",
        "<i class='fas fa-briefcase'></i> Assigning random jobs they'll complain about with realistic career paths and workplace dynamics. We're creating detailed employment histories that include job satisfaction levels, workplace relationships, and career aspirations. This affects their purchasing power, shopping schedules, and product preferences in meaningful ways...",
        "<i class='fas fa-baby'></i> Deciding who gets kids and creating realistic family dynamics that influence shopping decisions. We're programming family structures that range from single individuals to large families, including the impact of children on purchasing priorities, brand preferences, and shopping behaviors. Each family situation is designed to create authentic consumer scenarios...",
        "<i class='fas fa-paw'></i> Some are getting surprise pets that will affect their lifestyle choices and product preferences. We're adding pets to households where it makes sense, including the impact on home decor choices, cleaning product preferences, and even food shopping habits. Pet ownership creates unique consumer needs and brand loyalties...",
        "<i class='fas fa-dollar-sign'></i> Calculating incomes with realistic financial constraints and spending patterns. We're creating detailed financial profiles that include income levels, debt situations, savings habits, and discretionary spending patterns. This ensures that purchasing decisions and brand preferences are authentically tied to financial realities...",
        "<i class='fas fa-shopping-cart'></i> Teaching them how to shop online with realistic e-commerce behaviors and digital literacy levels. We're programming varying degrees of comfort with online shopping, from digital natives who prefer mobile apps to traditional shoppers who still prefer in-store experiences. This creates authentic discussions about omnichannel retail experiences...",
        "<i class='fas fa-coffee'></i> Brewing coffee for the professionals and creating realistic daily routines that influence shopping timing. We're programming daily schedules that affect when and how people shop, from early morning grocery runs to late-night online browsing sessions. These routines create authentic contexts for understanding consumer behavior patterns...",
        "<i class='fas fa-envelope'></i> Setting up email accounts with realistic inbox clutter and promotional email preferences. We're creating email histories that include subscription patterns, promotional email tolerance levels, and brand communication preferences. This affects how participants receive and respond to marketing messages...",
        "<i class='fas fa-graduation-cap'></i> Assigning educational backgrounds that influence their research habits and decision-making processes. We're creating educational histories that affect how participants gather information, evaluate options, and make purchasing decisions. This includes everything from formal education levels to self-directed learning preferences...",
        "<i class='fas fa-house-user'></i> Finding suitable living arrangements that reflect real-world housing diversity and lifestyle choices. We're placing participants in housing situations that range from shared apartments to owned homes, each with realistic constraints and opportunities that affect their shopping behaviors and product preferences...",
        "<i class='fas fa-heart'></i> Playing matchmaker for the married ones and creating relationship dynamics that influence joint purchasing decisions. We're programming relationship statuses that affect how shopping decisions are made, from single individuals making independent choices to couples who need to compromise on purchases. This creates authentic scenarios for understanding family decision-making...",
        "<i class='fas fa-leaf'></i> Making some of them eco-conscious with realistic environmental values and sustainable shopping preferences. We're programming varying levels of environmental awareness that affect product choices, from those who prioritize sustainability to those who focus primarily on price and convenience. This creates meaningful discussions about values-based purchasing...",
        "<i class='fas fa-cat'></i> Distributing cats to cat people and creating pet-related shopping behaviors that influence household decisions. We're adding pets to households where it makes sense, including the impact on home decor, cleaning products, and even food shopping habits. Pet ownership creates unique consumer needs and brand loyalties that add authenticity to discussions...",
        "<i class='fas fa-dragon'></i> Finding reptiles for the brave ones and creating unique pet ownership scenarios that affect lifestyle choices. We're adding exotic pets to households where it makes sense, including the specialized needs and shopping requirements that come with unusual pets. This creates interesting discussion points about specialized consumer needs...",
        "<i class='fas fa-shopping-bag'></i> Creating shopping addictions and realistic purchasing patterns that reflect real consumer behavior. We're programming varying levels of shopping enthusiasm, from bargain hunters to impulse buyers to careful researchers. Each shopping style creates authentic scenarios for understanding different consumer motivations and decision-making processes...",
        "<i class='fas fa-mobile-alt'></i> Teaching them to argue about electronics and creating realistic brand loyalty patterns. We're programming technology preferences and brand allegiances that create authentic discussions about product choices. This includes everything from iOS vs Android debates to gaming console preferences to smart home technology adoption...",
        "<i class='fas fa-tshirt'></i> Updating their fashion sense and creating realistic style preferences that influence clothing and accessory purchases. We're programming fashion awareness levels and style preferences that range from fashion-forward trendsetters to practical minimalists. This affects everything from clothing choices to accessory preferences to shopping frequency...",
        "<i class='fas fa-hammer'></i> Renovating their imaginary homes and creating realistic DIY skill levels that affect home improvement purchases. We're programming varying levels of DIY enthusiasm and skill, from professional contractors to complete beginners. This creates authentic discussions about home improvement products, tools, and services...",
        "<i class='fas fa-seedling'></i> Planting gardens they'll never water and creating realistic outdoor living preferences. We're programming varying levels of outdoor activity and gardening interest, from avid gardeners to those who prefer low-maintenance landscaping. This affects purchases of outdoor furniture, gardening supplies, and outdoor entertainment products...",
        "<i class='fas fa-stethoscope'></i> Scheduling their annual checkups and creating realistic health consciousness levels. We're programming varying degrees of health awareness that affect purchasing decisions, from those who prioritize organic and health-focused products to those who focus primarily on convenience and taste. This creates meaningful discussions about health-related purchasing...",
        "<i class='fas fa-car'></i> Picking cars they can't afford and creating realistic transportation preferences. We're programming vehicle ownership scenarios that affect lifestyle choices and purchasing decisions, from luxury car enthusiasts to practical commuters. This includes everything from car maintenance preferences to fuel efficiency concerns to vehicle-related purchases...",
        "<i class='fas fa-magic'></i> Adding quirky personality traits and creating unique character quirks that make discussions more engaging. We're programming individual personality traits that range from outgoing social butterflies to quiet observers, each with their own communication style and contribution patterns. This ensures dynamic and authentic group discussions...",
        "<i class='fas fa-chart-bar'></i> Making sure they're statistically diverse and creating balanced demographic representation. We're carefully analyzing the group composition to ensure optimal diversity across all relevant factors, from age and income to lifestyle and shopping preferences. This balanced approach ensures comprehensive insights from multiple perspectives...",
        "<i class='fas fa-trophy'></i> Almost done with this circus - just adding the final touches to make your focus group participants truly exceptional. We're putting the finishing touches on each participant profile, ensuring that every detail contributes to creating the most insightful and engaging focus group experience possible. Your participants are almost ready to provide you with the valuable insights you need..."
    ];

    const categoryMessages = {
        // Shopping Behavior Categories
        "general_consumers": [
            "<i class='fas fa-shopping-cart'></i> Teaching them to shop responsibly and make informed purchasing decisions. We're programming their shopping habits to include thorough research, price comparisons, and thoughtful consideration before each purchase. They'll be the kind of consumers who read reviews, check return policies, and think twice before impulse buying...",
            "<i class='fas fa-credit-card'></i> Setting up their rewards cards and loyalty programs. We're creating detailed profiles with various credit cards, store loyalty memberships, and cashback apps. Each participant will have a unique combination of payment methods and reward strategies, making them savvy about maximizing their benefits and earning points...",
            "<i class='fas fa-building'></i> Mapping their favorite stores and shopping destinations. We're building comprehensive shopping preferences including local malls, online retailers, specialty stores, and discount outlets. Each person will have their go-to places for different types of purchases, from groceries to electronics to clothing...",
            "<i class='fas fa-box'></i> Tracking their packages and managing delivery expectations. We're programming them with realistic delivery timelines, tracking number obsessions, and the patience (or impatience) that comes with online shopping. They'll have stories about lost packages, surprise early deliveries, and the joy of unboxing...",
            "<i class='fas fa-shopping-bag'></i> Filling their shopping carts with carefully selected items. We're creating shopping lists, wish lists, and abandoned cart scenarios. Each participant will have their own shopping rhythm - some plan everything meticulously, others browse and discover, and some are impulse buyers who need to be reined in..."
        ],
        "online_shoppers": [
            "<i class='fas fa-box'></i> Creating Amazon addictions and Prime membership dependencies. We're programming them with the 'buy now, think later' mentality that comes with one-click ordering. They'll have stories about accidental purchases, subscription services they forgot about, and the thrill of same-day delivery. Each participant will have their own Amazon wish list with hundreds of items they're 'thinking about'...",
            "<i class='fas fa-truck'></i> Scheduling midnight deliveries and tracking packages obsessively. We're creating delivery preferences ranging from 'leave at door' to 'require signature' to 'deliver to neighbor.' They'll have experiences with lost packages, surprise early deliveries, and the anxiety of waiting for expensive items. Some will prefer curbside pickup, others will want everything delivered to their doorstep...",
            "<i class='fas fa-laptop'></i> Opening 47 browser tabs and comparing prices across every possible retailer. We're programming them with the research-heavy shopping behavior that includes reading every review, checking multiple sites, and using price comparison tools. They'll have browser histories filled with product research, abandoned carts, and saved items. Each will have their own method of organizing their online shopping research...",
            "<i class='fas fa-shopping-cart'></i> Abandoning their carts strategically and then returning with better deals. We're creating shopping patterns that include leaving items in carts to trigger discount emails, using multiple accounts for different promotions, and the psychology of cart abandonment. They'll have stories about items they've had in carts for months, waiting for the perfect sale or coupon code...",
            "<i class='fas fa-envelope'></i> Subscribing to every newsletter and managing email marketing preferences. We're programming them with email inboxes full of promotional emails, loyalty program updates, and sale notifications. They'll have strategies for managing these emails, from creating separate shopping email addresses to using email filters. Each will have their own tolerance for marketing emails and their own methods of staying informed about deals..."
        ],
        "budget_conscious_shoppers": [
            "<i class='fas fa-tag'></i> Clipping digital coupons and mastering the art of coupon stacking. We're programming them with extensive coupon databases, loyalty program knowledge, and the patience to wait for the perfect deal. They'll have strategies for combining manufacturer coupons with store coupons, using rebate apps, and timing their purchases with sales cycles. Each participant will have their own coupon organization system and success stories about massive savings...",
            "<i class='fas fa-chart-bar'></i> Comparing prices across 10 sites and creating detailed spreadsheets for major purchases. We're building analytical shopping behaviors that include price tracking tools, historical price data, and the ability to spot fake sales. They'll have price comparison apps, browser extensions for finding the best deals, and the discipline to never pay full price. Each will have their own threshold for what constitutes a 'good deal' and their own methods of tracking price history...",
            "<i class='fas fa-dollar-sign'></i> Calculating cost per ounce, unit price, and total cost of ownership for every purchase. We're programming them with the mathematical mindset that evaluates not just the sticker price, but the long-term value. They'll consider factors like durability, maintenance costs, energy efficiency, and resale value. Each participant will have their own formulas for determining value and their own categories where they're willing to splurge versus save...",
            "<i class='fas fa-tag'></i> Waiting for sales and understanding seasonal shopping patterns. We're creating shopping calendars that include Black Friday strategies, end-of-season clearance timing, and the patience to wait months for the right price. They'll have knowledge about when different retailers have their biggest sales, how to get early access to sales, and the art of negotiating prices. Each will have their own rules about what's worth waiting for versus what they need immediately...",
            "<i class='fas fa-mobile-alt'></i> Installing every cashback app and maximizing reward opportunities. We're programming them with multiple cashback apps, credit card reward strategies, and the discipline to always check for cashback before making purchases. They'll have systems for tracking their rewards, understanding different cashback rates, and optimizing their spending to maximize returns. Each participant will have their own preferred apps and strategies for earning the most rewards..."
        ],
        "luxury_buyers": [
            "<i class='fas fa-credit-card'></i> Polishing their credit cards and maintaining impeccable credit scores for premium financing options. We're programming them with high-limit credit cards, concierge services, and the financial sophistication that comes with luxury purchasing power. They'll have relationships with personal bankers, access to exclusive financing terms, and the ability to make large purchases without batting an eye. Each participant will have their own collection of premium credit cards and their own strategies for maximizing luxury benefits...",
            "<i class='fas fa-wine-glass'></i> Popping champagne and celebrating major purchases with elaborate unboxing experiences. We're creating luxury shopping rituals that include champagne toasts for new acquisitions, professional photography of unboxing moments, and the social media sharing that accompanies high-end purchases. They'll have stories about memorable shopping experiences, personal shoppers who know their preferences, and the joy of acquiring pieces that become family heirlooms. Each will have their own luxury shopping traditions and ways of commemorating significant purchases...",
            "<i class='fas fa-shopping-bag'></i> Authenticating designer bags and building relationships with luxury brand representatives. We're programming them with extensive knowledge about luxury brands, authentication methods, and the subtle details that distinguish genuine articles from counterfeits. They'll have personal relationships with sales associates, access to limited editions, and the patience to wait months for exclusive pieces. Each participant will have their own collection of luxury items and their own criteria for what constitutes a worthwhile investment...",
            "<i class='fas fa-car'></i> Valet parking their concerns and enjoying white-glove service at every shopping destination. We're creating luxury shopping experiences that include personal shoppers, private shopping appointments, and VIP treatment at retail establishments. They'll have memberships to exclusive shopping clubs, access to pre-sale events, and the expectation of exceptional service. Each will have their own preferred luxury retailers and their own standards for what constitutes acceptable service levels...",
            "<i class='fas fa-sparkles'></i> Adding extra zeros to budgets and considering luxury purchases as investments rather than expenses. We're programming them with the mindset that views high-end purchases as appreciating assets, status symbols, and lifestyle investments. They'll have knowledge about luxury market trends, resale values, and the long-term benefits of quality craftsmanship. Each participant will have their own investment strategy for luxury items and their own criteria for determining which purchases are worth the premium price..."
        ],
        "eco_conscious_consumers": [
            "<i class='fas fa-recycle'></i> Calculating carbon footprints...",
            "<i class='fas fa-leaf'></i> Growing their own everything...",
            "<i class='fas fa-shopping-bag'></i> Bringing reusable bags...",
            "<i class='fas fa-globe-americas'></i> Saving the planet one purchase at a time...",
            "<i class='fas fa-leaf'></i> Composting their receipts..."
        ],

        // Product Categories
        "electronics_buyers": [
            "<i class='fas fa-plug'></i> Untangling their cable collections and organizing their tech accessories with the precision of a professional IT manager. We're programming them with extensive collections of charging cables, adapters, and tech accessories that reflect real-world gadget ownership. Each participant will have their own system for managing cords, from elaborate cable organizers to the classic 'throw it in a drawer' approach. They'll have stories about lost chargers, incompatible cables, and the eternal quest for the perfect cable management solution...",
            "<i class='fas fa-mobile-alt'></i> Arguing about iOS vs Android with the passion of religious debates and creating realistic brand loyalty patterns. We're programming deep-seated preferences for mobile operating systems that affect everything from app choices to accessory purchases to ecosystem loyalty. Each participant will have their own reasons for their platform choice, from technical preferences to social influences to ecosystem lock-in. They'll have strong opinions about app quality, customization options, and the overall user experience of their chosen platform...",
            "<i class='fas fa-gamepad'></i> Updating their graphics drivers and maintaining gaming setups with the dedication of professional gamers. We're programming varying levels of gaming enthusiasm and technical expertise, from casual mobile gamers to hardcore PC enthusiasts. Each participant will have their own gaming preferences, from console gaming to PC gaming to mobile gaming, each with their own purchasing patterns and brand loyalties. They'll have opinions about graphics cards, gaming peripherals, and the latest gaming trends...",
            "<i class='fas fa-laptop'></i> Adding RGB lighting to everything and creating personalized computing environments that reflect individual style preferences. We're programming varying degrees of customization enthusiasm, from those who love RGB everything to those who prefer clean, minimal setups. Each participant will have their own approach to personalizing their tech, from elaborate lighting setups to simple, functional arrangements. This affects their purchasing decisions for everything from laptops to peripherals to desk accessories...",
            "<i class='fas fa-plug'></i> Charging all their devices and managing power consumption with the efficiency of a power management expert. We're programming realistic device ownership patterns that include multiple smartphones, tablets, laptops, smartwatches, and other connected devices. Each participant will have their own charging strategy, from wireless charging pads to elaborate charging stations to the classic 'plug it in wherever there's an outlet' approach. They'll have opinions about charging speeds, battery life, and power management solutions..."
        ],
        "fashion_and_apparel_shoppers": [
            "<i class='fas fa-tshirt'></i> Organizing their closets by color...",
            "<i class='fas fa-tshirt'></i> Teaching them to walk in heels...",
            "<i class='fas fa-tshirt'></i> Deciding between 10 black jackets...",
            "<i class='fas fa-tshirt'></i> Matching patterns like pros...",
            "<i class='fas fa-shopping-bag'></i> Filling their online carts..."
        ],
        "grocery_and_household_shoppers": [
            "<i class='fas fa-carrot'></i> Debating organic vs conventional...",
            "<i class='fas fa-shopping-cart'></i> Navigating grocery store layouts...",
            "<i class='fas fa-toilet-paper'></i> Stockpiling toilet paper (reasonably)...",
            "<i class='fas fa-box'></i> Organizing their pantries...",
            "<i class='fas fa-pen'></i> Writing shopping lists they'll forget..."
        ],
        "beauty_and_personal_care_shoppers": [
            "<i class='fas fa-palette'></i> Perfecting their skincare routines...",
            "<i class='fas fa-palette'></i> Choosing between 50 nude lipsticks...",
            "<i class='fas fa-soap'></i> Reading ingredient lists...",
            "<i class='fas fa-sparkles'></i> Adding glow to their complexions...",
            "<i class='fas fa-soap'></i> Running their bath water..."
        ],
        "baby_and_kids_product_buyers": [
            "<i class='fas fa-baby'></i> Testing every baby gadget...",
            "<i class='fas fa-baby'></i> Baby-proofing their homes...",
            "<i class='fas fa-cookie'></i> Stepping on LEGOs (ouch!)...",
            "<i class='fas fa-paint-brush'></i> Cleaning crayon off walls...",
            "<i class='fas fa-clock'></i> Memorizing lullabies..."
        ],
        "home_improvement_diyers": [
            "<i class='fas fa-hammer'></i> Measuring twice, cutting once...",
            "<i class='fas fa-home'></i> Watching DIY videos on repeat...",
            "<i class='fas fa-paint-brush'></i> Choosing between 50 shades of beige...",
            "<i class='fas fa-wrench'></i> Reorganizing their tool sheds...",
            "<i class='fas fa-plug'></i> Installing smart everything..."
        ],
        "furniture_and_decor_shoppers": [
            "<i class='fas fa-couch'></i> Assembling Swedish furniture...",
            "<i class='fas fa-paint-brush'></i> Hanging pictures perfectly straight...",
            "<i class='fas fa-couch'></i> Arranging throw pillows...",
            "<i class='fas fa-leaf'></i> Not killing their houseplants...",
            "<i class='fas fa-tape'></i> Measuring every space twice..."
        ],
        "garden_and_outdoor_living": [
            "<i class='fas fa-seedling'></i> Planting their dreams...",
            "<i class='fas fa-seedling'></i> Talking to their plants...",
            "<i class='fas fa-leaf'></i> Making friends with earthworms...",
            "<i class='fas fa-leaf'></i> Identifying every weed species...",
            "<i class='fas fa-seedling'></i> Setting up sprinkler systems..."
        ],
        "office_and_business_supplies": [
            "<i class='fas fa-paperclip'></i> Organizing their paperclips by size...",
            "<i class='fas fa-pen'></i> Testing every pen in the store...",
            "<i class='fas fa-folder-open'></i> Color-coding their filing systems...",
            "<i class='fas fa-print'></i> Fighting with printers...",
            "<i class='fas fa-paperclip'></i> Covering walls with sticky notes..."
        ],
        "automotive_enthusiasts": [
            "<i class='fas fa-car'></i> Revving their engines...",
            "<i class='fas fa-wrench'></i> Debating oil change intervals...",
            "<i class='fas fa-car'></i> Calculating 0-60 times...",
            "<i class='fas fa-car'></i> Waxing their rides...",
            "<i class='fas fa-music'></i> Programming their presets..."
        ],
        "pet_dog": [
            "<i class='fas fa-dog'></i> Teaching them the perfect 'who's a good boy' voice...",
            "<i class='fas fa-paw'></i> Calculating treat-to-training ratios...",
            "<i class='fas fa-dog'></i> Planning walkies schedules...",
            "<i class='fas fa-dog'></i> Throwing infinite tennis balls...",
            "<i class='fas fa-paw'></i> Vacuuming fur (it's everywhere)..."
        ],
        "pet_cat": [
            "<i class='fas fa-cat'></i> Earning their cats' indifference...",
            "<i class='fas fa-box'></i> Providing cardboard boxes...",
            "<i class='fas fa-fish'></i> Serving gourmet cat food (they'll ignore)...",
            "<i class='fas fa-cat'></i> Untangling yarn disasters...",
            "<i class='fas fa-cat'></i> Installing cat trees they won't use..."
        ],
        "pet_bird": [
            "<i class='fas fa-feather'></i> Teaching them to say 'Polly wants participants'...",
            "<i class='fas fa-music'></i> Creating morning song playlists...",
            "<i class='fas fa-feather'></i> Collecting pretty feathers...",
            "<i class='fas fa-feather'></i> Cracking seeds all day...",
            "<i class='fas fa-home'></i> Building elaborate perches..."
        ],
        "pet_fish": [
            "<i class='fas fa-fish'></i> Testing water pH levels...",
            "<i class='fas fa-fish'></i> Creating the perfect bubble streams...",
            "<i class='fas fa-home'></i> Decorating underwater castles...",
            "<i class='fas fa-fish'></i> Maintaining that perfect tank sparkle...",
            "<i class='fas fa-fish'></i> Teaching them to swim in formation..."
        ],
        "pet_small_animals": [
            "<i class='fas fa-paw'></i> Setting up hamster wheels...",
            "<i class='fas fa-carrot'></i> Chopping veggie buffets...",
            "<i class='fas fa-home'></i> Building tiny furniture...",
            "<i class='fas fa-carrot'></i> Organizing hay supplies...",
            "<i class='fas fa-paw'></i> Creating mini obstacle courses..."
        ],
        "pet_reptiles": [
            "<i class='fas fa-paw'></i> Adjusting heat lamp temperatures...",
            "<i class='fas fa-paw'></i> Breeding cricket snacks...",
            "<i class='fas fa-seedling'></i> Creating perfect basking spots...",
            "<i class='fas fa-home'></i> Decorating terrariums...",
            "<i class='fas fa-paw'></i> Maintaining humidity levels..."
        ]
    };

    // Convert selected categories to lowercase with underscores for matching
    const normalizedCategories = selectedCategories.map(cat => 
        cat.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
    );

    // Collect all relevant messages
    let allMessages = [...baseMessages];
    
    normalizedCategories.forEach(category => {
        if (categoryMessages[category]) {
            allMessages = allMessages.concat(categoryMessages[category]);
        }
    });

    // Shuffle the messages for variety
    return shuffleArray(allMessages);
}

// Helper function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Calculate reading time for a message (rough estimate)
function calculateReadingTime(message) {
    const words = message.replace(/<[^>]*>/g, '').split(' ').length;
    const wordsPerMinute = 200;
    const readingTimeSeconds = (words / wordsPerMinute) * 60;
    return Math.max(3, Math.min(8, readingTimeSeconds)); // Between 3-8 seconds
}



async function handleFocusGroupForm(e) {
    e.preventDefault();
    
    const formData = new FormData(focusGroupForm);
    const selectedCategories = getSelectedCategories();
    
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
    
    // Prepare webhook data for participant selection from database
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
    
    console.log('Focus group data to be sent:', webhookData);
    console.log('Webhook data JSON string:', JSON.stringify(webhookData, null, 2));
    
    // Show loading screen
    showLoadingScreen(selectedCategories, formData.get('sessionType'), formData.get('sessionName'));
    
    // Start 5-minute timeout (hidden)
    const timeoutDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    const timeoutId = setTimeout(() => {
        hideLoadingScreen();
        showErrorScreen(`Request timed out after 5 minutes.\n\nThis might be due to:\n• High server load\n• Complex AI processing\n• Network issues\n\nPlease try again in a few minutes.`);
    }, timeoutDuration);
    
    // Store timeout ID for cleanup
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.dataset.timeoutId = timeoutId;
    }
    
    try {
        // Simplified approach: Use CORS proxy directly for GitHub Pages
        let response = null;
        let lastError = null;
        
        console.log('Request data:', webhookData);
        console.log('Request body length:', JSON.stringify(webhookData).length);
        
        // Try CORS proxies in sequence
        const proxies = [
            "https://api.allorigins.win/raw?url=",
            "https://thingproxy.freeboard.io/fetch/",
            "https://cors.bridged.cc/"
        ];
        
        for (let i = 0; i < proxies.length; i++) {
            try {
                const webhookUrl = proxies[i] + CONFIG.WEBHOOK_URL;
                console.log(`Trying proxy ${i + 1}:`, webhookUrl);
                
                response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(webhookData),
                    signal: AbortSignal.timeout(600000), // 10 minute timeout
                    mode: 'cors',
                    credentials: 'omit'
                });
                
                console.log(`Proxy ${i + 1} response status:`, response.status);
                
                if (response.status === 403) {
                    console.log(`Proxy ${i + 1} returned 403, trying next...`);
                    continue;
                }
                
                console.log(`Proxy ${i + 1} worked!`);
                break;
                
            } catch (proxyError) {
                console.error(`Proxy ${i + 1} failed:`, proxyError);
                lastError = proxyError;
                
                if (i === proxies.length - 1) {
                    throw proxyError;
                }
                continue;
            }
        }
        
        if (!response) {
            throw lastError || new Error('All proxies failed. Please use the local server for testing.');
        }
        
        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);
        console.log('Response headers:', response.headers);
        
        // Check response headers first to determine how to handle the response
        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');
        const contentLength = response.headers.get('content-length');
        
        console.log('Content-Type:', contentType);
        console.log('Content-Disposition:', contentDisposition);
        console.log('Content-Length:', contentLength);
        
        // Check if response is empty
        if (contentLength === '0' || contentLength === null) {
            console.log('Warning: Response appears to be empty');
        }
        
        // Check if response is JSON with base64 content
        const isJsonResponse = contentType && contentType.includes('application/json');
        
        if (isJsonResponse) {
            // Handle JSON response (potentially with base64 content)
            try {
                const result = await response.json();
                console.log('Response data:', result);
                
                hideLoadingScreen();
                
                if (response.ok) {
                    // Save questions for future use
                    const questions = sessionSpecificData.questions || [];
                    if (questions.length > 0) {
                        saveQuestions(sessionType, questions);
                    }
                    
                    // Check if response contains base64 file content
                    if (result.base64Content && result.filename) {
                        // Convert base64 to blob and show download screen
                        const base64Data = result.base64Content;
                        const filename = result.filename;
                        
                        // Remove data URL prefix if present
                        const base64String = base64Data.replace(/^data:text\/plain;base64,/, '');
                        
                        // Convert base64 to blob
                        const byteCharacters = atob(base64String);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], { type: 'text/plain' });
                        
                        showFileDownloadScreen({
                            filename: filename,
                            blob: blob,
                            sessionName: webhookData.session_name,
                            categories: webhookData.categories,
                            totalCount: webhookData.number_of_participants
                        });
                    } else {
                        // Regular JSON response
                        showResponseScreen(result);
                    }
                } else {
                    showErrorScreen(`Server error: ${result.error || 'Unknown error'}`);
                }
            } catch (jsonError) {
                console.error('Error parsing JSON response:', jsonError);
                hideLoadingScreen();
                showErrorScreen(`Error processing response: ${jsonError.message}`);
            }
        } else {
            // Determine if this is a file download based on headers
            const isFileDownload = contentType && contentType.includes('text/plain') && 
                                  contentDisposition && contentDisposition.includes('attachment');
            
            if (isFileDownload) {
                // Handle file download - read as blob
                try {
                    const blob = await response.blob();
                    const filename = getFilenameFromDisposition(contentDisposition) || `focus-group-${webhookData.session_name}-${Date.now()}.txt`;
                    
                    // Save questions for future use
                    const questions = sessionSpecificData.questions || [];
                    if (questions.length > 0) {
                        saveQuestions(sessionType, questions);
                    }
                    
                    hideLoadingScreen();
                    showFileDownloadScreen({
                        filename: filename,
                        blob: blob,
                        sessionName: webhookData.session_name,
                        categories: webhookData.categories,
                        totalCount: webhookData.number_of_participants
                    });
                } catch (blobError) {
                    console.error('Error reading response as blob:', blobError);
                    hideLoadingScreen();
                    showErrorScreen(`Error processing file download: ${blobError.message}`);
                }
            } else {
                // Handle JSON response - read as JSON first, fallback to text if needed
                try {
                    const result = await response.json();
                    console.log('Response data:', result);
                    
                    hideLoadingScreen();
                    
                    if (response.ok) {
                        // Save questions for future use
                        const questions = sessionSpecificData.questions || [];
                        if (questions.length > 0) {
                            saveQuestions(sessionType, questions);
                        }
                        
                        showResponseScreen({
                            success: true,
                            message: `Focus group "${webhookData.session_name}" started successfully!`,
                            categories: webhookData.categories,
                            total_count: webhookData.number_of_participants,
                            existing_count: 0,
                            created_count: webhookData.number_of_participants
                        });
                    } else {
                        showErrorScreen(result.message || `HTTP ${response.status}: ${response.statusText}`);
                    }
                } catch (jsonError) {
                    console.error('JSON parsing error:', jsonError);
                    console.log('Response status:', response.status);
                    console.log('Response headers:', response.headers);
                    
                    // Try to read as text for error diagnosis
                    try {
                        const responseText = await response.text();
                        console.log('Response text length:', responseText.length);
                        console.log('Response text (first 500 chars):', responseText.substring(0, 500));
                        
                        hideLoadingScreen();
                        
                        if (responseText.length === 0) {
                            showErrorScreen(`Webhook returned an empty response. This might indicate:\n\n• The n8n workflow is still processing\n• The webhook is not configured correctly\n• The CORS proxy is not forwarding the response properly\n\nPlease try again or use the local server for testing.`);
                        } else if (responseText.includes('html') || responseText.includes('<!DOCTYPE')) {
                            showErrorScreen(`Webhook returned HTML instead of JSON. This usually means:\n\n• The webhook URL is incorrect\n• The n8n workflow is not active\n• The server is returning an error page\n\nResponse: ${responseText.substring(0, 200)}...`);
                        } else {
                            showErrorScreen(`Webhook returned invalid JSON. Response: ${responseText.substring(0, 200)}...`);
                        }
                    } catch (textError) {
                        console.error('Error reading response as text:', textError);
                        console.log('Response status:', response.status);
                        console.log('Response status text:', response.statusText);
                        console.log('Response headers:', response.headers);
                        
                        hideLoadingScreen();
                        
                        // Check if response is empty or has issues
                        if (response.status === 200) {
                            showErrorScreen(`Received 200 OK but couldn't read response content.\n\nThis might be a temporary issue. Please try:\n\n1. Refreshing the page and trying again\n2. Waiting a few minutes and trying again\n3. Using a different browser\n\nIf the issue persists, you can also use the local version for testing.`);
                        } else if (response.status === 504) {
                            showErrorScreen(`Gateway Timeout (504): The n8n workflow is taking longer than expected.\n\nThis is normal for AI-powered workflows. Please try again in a few minutes.`);
                        } else {
                            showErrorScreen(`Unable to read response content. Status: ${response.status}, StatusText: ${response.statusText}`);
                        }
                    }
                }
            }
        
    } catch (error) {
        console.error('Error starting focus group:', error);
        hideLoadingScreen();
        
        // Provide more specific error messages
        let errorMessage = 'Network error: ';
        
        if (error.name === 'AbortError') {
            errorMessage += 'Request timed out after 5 minutes. The n8n workflow may be taking longer than expected. Please try again.';
        } else if (error.message.includes('All CORS proxies returned 403')) {
            errorMessage += 'All CORS proxies are currently blocked. This is a common issue with public proxies.\n\n' +
                          'For reliable testing, please use the local server:\n' +
                          '1. Run .\\start-cors-server.bat\n' +
                          '2. Open http://localhost:8000\n' +
                          '3. Try submitting the form again';
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage += 'Unable to connect to the webhook due to browser security restrictions.\n\n' +
                          'For immediate access:\n\n' +
                          '1. Download the files from: https://github.com/CreativVentures-hub/focus-group-ai\n' +
                          '2. Extract the ZIP file to your computer\n' +
                          '3. Double-click "start-cors-server.bat"\n' +
                          '4. Open http://localhost:8000 in your browser\n\n' +
                          'The local version will work perfectly with your n8n webhook!';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Failed to fetch from webhook due to browser security restrictions.\n\n' +
                          'For immediate access:\n\n' +
                          '1. Download the files from: https://github.com/CreativVentures-hub/focus-group-ai\n' +
                          '2. Extract the ZIP file to your computer\n' +
                          '3. Double-click "start-cors-server.bat"\n' +
                          '4. Open http://localhost:8000 in your browser\n\n' +
                          'The local version will work perfectly with your n8n webhook!';
        } else {
            errorMessage += error.message;
        }
        
        showErrorScreen(errorMessage);
    }
}

function showMainSection() {
    console.log('showMainSection called');
    console.log('loginSection element:', loginSection);
    console.log('mainSection element:', mainSection);
    
    if (loginSection && mainSection) {
    loginSection.style.display = 'none';
    mainSection.style.display = 'block';
        console.log('Sections updated successfully');
    
    // Re-initialize slider after showing main section
    setTimeout(() => {
        initializeSlider();
    }, 100);
    } else {
        console.error('Section elements not found!');
    }
}

function showLoginSection() {
    mainSection.style.display = 'none';
    loginSection.style.display = 'block';
}

function clearLoginForm() {
    loginForm.reset();
    loginError.style.display = 'none';
}

function showLoginError() {
    loginError.style.display = 'block';
    passwordInput.focus();
    
    // Clear error after 3 seconds
    setTimeout(() => {
        loginError.style.display = 'none';
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

function showFormSuccess(form, message) {
    // Remove any existing success messages
    const existingSuccess = form.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create and show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    form.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Category Modal Functions
function setupCategoryModal() {
    // Open modal
    openCategoryModal.addEventListener('click', () => {
        showCategoryModal();
    });
    
    // Close modal
    closeCategoryModal.addEventListener('click', () => {
        hideCategoryModal();
    });
    
    // Close modal when clicking outside
    categoryModal.addEventListener('click', (e) => {
        if (e.target === categoryModal) {
            hideCategoryModal();
        }
    });
    
    // Apply selection
    applyCategories.addEventListener('click', () => {
        applyCategorySelection();
    });
    
    // Clear all categories
    clearAllCategories.addEventListener('click', () => {
        clearAllCategorySelections();
    });
    
    // Handle search in modal
    categorySearch.addEventListener('input', (e) => {
        filterCategoryModal(e.target.value);
    });
    
    // Initialize selected categories array
    window.selectedCategories = [];
}

// Demographic Modal Functions
function setupDemographicModals() {
    // Gender Modal
    setupModal('gender', 'openGenderModal', 'closeGenderModal', 'applyGenders', 'clearAllGenders');
    
    // Age Modal
    setupModal('age', 'openAgeModal', 'closeAgeModal', 'applyAges', 'clearAllAges');
    
    // Income Modal
    setupModal('income', 'openIncomeModal', 'closeIncomeModal', 'applyIncomes', 'clearAllIncomes');
    
    // Marital Modal
    setupModal('marital', 'openMaritalModal', 'closeMaritalModal', 'applyMaritals', 'clearAllMaritals');
    
    // Children Modal
    setupModal('children', 'openChildrenModal', 'closeChildrenModal', 'applyChildren', 'clearAllChildren');
    
    // Education Modal
    setupModal('education', 'openEducationModal', 'closeEducationModal', 'applyEducations', 'clearAllEducations');
    
    // Race Modal
    setupModal('race', 'openRaceModal', 'closeRaceModal', 'applyRaces', 'clearAllRaces');
}

function setupModal(type, openBtnId, closeBtnId, applyBtnId, clearBtnId) {
    const openBtn = document.getElementById(openBtnId);
    const closeBtn = document.getElementById(closeBtnId);
    const applyBtn = document.getElementById(applyBtnId);
    const clearBtn = document.getElementById(clearBtnId);
    const modal = document.getElementById(type + 'Modal');
    const list = document.getElementById(type + 'List');
    
    console.log(`Setting up ${type} modal:`, {
        openBtn: openBtn,
        closeBtn: closeBtn,
        applyBtn: applyBtn,
        clearBtn: clearBtn,
        modal: modal,
        list: list
    });
    
    // Check if all elements exist
    if (!openBtn || !closeBtn || !applyBtn || !clearBtn || !modal || !list) {
        console.error(`Missing elements for ${type} modal:`, {
            openBtn: !!openBtn,
            closeBtn: !!closeBtn,
            applyBtn: !!applyBtn,
            clearBtn: !!clearBtn,
            modal: !!modal,
            list: !!list
        });
        return;
    }
    
    // Initialize selected items array
    window['selected' + type.charAt(0).toUpperCase() + type.slice(1) + 's'] = [];
    
    // Open modal
    openBtn.addEventListener('click', () => {
        console.log(`Opening ${type} modal`);
        showModal(modal);
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        console.log(`Closing ${type} modal`);
        hideModal(modal);
    });
    
    // Apply selection
    applyBtn.addEventListener('click', () => {
        console.log(`Applying ${type} selection`);
        applySelection(type, list, modal);
    });
    
    // Clear all
    clearBtn.addEventListener('click', () => {
        console.log(`Clearing all ${type} selections`);
        clearAllSelections(list);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log(`Closing ${type} modal (outside click)`);
            hideModal(modal);
        }
    });
    
    // Setup checkbox interactions
    setupCheckboxInteractions(list);
    
    console.log(`${type} modal setup complete`);
}

function setupCheckboxInteractions(list) {
    const checkboxes = list.querySelectorAll('.category-checkbox');
    
    checkboxes.forEach(container => {
        const checkbox = container.querySelector('input[type="checkbox"]');
        
        // Handle checkbox change
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                container.classList.add('selected');
            } else {
                container.classList.remove('selected');
            }
        });
        
        // Handle container click
        container.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
                container.classList.add('selected');
            } else {
                container.classList.remove('selected');
            }
        });
    });
}

function showModal(modal) {
    console.log('showModal called with:', modal);
    if (modal) {
        modal.style.display = 'flex';
        console.log('Modal display set to flex');
    } else {
        console.error('showModal called with null modal');
    }
}

function hideModal(modal) {
    console.log('hideModal called with:', modal);
    if (modal) {
        modal.style.display = 'none';
        console.log('Modal display set to none');
    } else {
        console.error('hideModal called with null modal');
    }
}

function applySelection(type, list, modal) {
    console.log(`applySelection called for type: ${type}`);
    
    const checkboxes = list.querySelectorAll('input[type="checkbox"]:checked');
    const selectedItems = Array.from(checkboxes).map(checkbox => checkbox.dataset.category);
    
    console.log(`Selected items for ${type}:`, selectedItems);
    
    // Store selected items
    let arrayName;
    if (type === 'marital') arrayName = 'selectedMaritals';
    else if (type === 'children') arrayName = 'selectedChildren';
    else arrayName = 'selected' + type.charAt(0).toUpperCase() + type.slice(1) + 's';
    
    window[arrayName] = selectedItems;
    
    
    
    // Update display
    updateSelectionDisplay(type, selectedItems);
    updateSelectionButton(type, selectedItems);
    updateSelectionHiddenInput(type, selectedItems);
    
    hideModal(modal);
}

function updateSelectionDisplay(type, selectedItems) {
    const container = document.querySelector('.selected-categories');
    
    if (!container) {
        console.error('Selected categories container not found');
        return;
    }
    
    // Remove existing chips for this type
    const existingChips = container.querySelectorAll(`[data-type="${type}"]`);
    existingChips.forEach(chip => chip.remove());
    
    // Get appropriate icon for each type
    const getIconForType = (type) => {
        switch(type) {
            case 'category': return 'fas fa-tags';
            case 'gender': return 'fas fa-venus-mars';
            case 'age': return 'fas fa-birthday-cake';
            case 'income': return 'fas fa-dollar-sign';
            case 'marital': return 'fas fa-heart';
            case 'children': return 'fas fa-baby';
            case 'education': return 'fas fa-graduation-cap';
            case 'race': return 'fas fa-globe-americas';
            default: return 'fas fa-tag';
        }
    };
    
    const iconClass = getIconForType(type);
    
    // Add new chips for this type
    selectedItems.forEach(item => {
        const tag = document.createElement('div');
        tag.className = 'selected-category-tag';
        tag.setAttribute('data-type', type);
        tag.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${item}</span>
            <button type="button" class="remove-category" onclick="removeSelection('${type}', '${item}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(tag);
    });
    
    // Update container visibility based on whether there are any chips
    const allChips = container.querySelectorAll('.selected-category-tag');
    const chipsContainer = document.querySelector('.selected-chips-container');
    
    if (allChips.length === 0) {
        chipsContainer.classList.add('empty');
    } else {
        chipsContainer.classList.remove('empty');
    }
}

function updateSelectionButton(type, selectedItems) {
    let buttonTextId, countId;
    if (type === 'category') {
        buttonTextId = 'categoryButtonText';
        countId = 'categoryCount';
    } else if (type === 'marital') {
        buttonTextId = 'maritalButtonText';
        countId = 'maritalCount';
    } else if (type === 'children') {
        buttonTextId = 'childrenButtonText';
        countId = 'childrenCount';
    } else if (type === 'education') {
        buttonTextId = 'educationButtonText';
        countId = 'educationCount';
    } else if (type === 'race') {
        buttonTextId = 'raceButtonText';
        countId = 'raceCount';
    } else {
        buttonTextId = type + 'ButtonText';
        countId = type + 'Count';
    }
    
    const buttonText = document.getElementById(buttonTextId);
    const count = document.getElementById(countId);
    
    console.log(`updateSelectionButton for ${type}:`, {
        buttonText: buttonText,
        count: count,
        selectedItems: selectedItems
    });
    
    if (!buttonText || !count) {
        console.error(`Button elements not found for ${type}:`, {
            buttonText: !!buttonText,
            count: !!count
        });
        return;
    }
    
    if (selectedItems.length === 0) {
        buttonText.textContent = `Select ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        count.style.display = 'none';
    } else {
        buttonText.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Selected`;
        count.textContent = `${selectedItems.length} selected`;
        count.style.display = 'inline';
    }
}

function updateSelectionHiddenInput(type, selectedItems) {
    let inputId;
    if (type === 'category') inputId = 'category';
    else if (type === 'age') inputId = 'age';
    else if (type === 'income') inputId = 'income';
    else if (type === 'marital') inputId = 'maritalStatus';
    else if (type === 'children') inputId = 'hasChildren';
    else if (type === 'gender') inputId = 'gender';
    else if (type === 'education') inputId = 'education';
    else if (type === 'race') inputId = 'race';
    else inputId = type;
    
    const hiddenInput = document.getElementById(inputId);
    
    console.log(`updateSelectionHiddenInput for ${type}:`, {
        inputId: inputId,
        hiddenInput: hiddenInput,
        selectedItems: selectedItems
    });
    
    if (!hiddenInput) {
        console.error(`Hidden input not found for ${type}: ${inputId}`);
        return;
    }
    
    hiddenInput.value = selectedItems.join(', ');
    console.log(`Set hidden input value to: ${hiddenInput.value}`);
}

function clearAllSelections(list) {
    const checkboxes = list.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.category-checkbox').classList.remove('selected');
    });
}

function removeSelection(type, item) {
    let arrayName;
    if (type === 'category') arrayName = 'selectedCategories';
    else if (type === 'marital') arrayName = 'selectedMaritals';
    else if (type === 'children') arrayName = 'selectedChildren';
    else if (type === 'education') arrayName = 'selectedEducations';
    else if (type === 'race') arrayName = 'selectedRaces';
    else arrayName = 'selected' + type.charAt(0).toUpperCase() + type.slice(1) + 's';
    
    const selectedArray = window[arrayName];
    const index = selectedArray.indexOf(item);
    if (index > -1) {
        selectedArray.splice(index, 1);
        updateSelectionDisplay(type, selectedArray);
        updateSelectionButton(type, selectedArray);
        updateSelectionHiddenInput(type, selectedArray);
    }
}

function populateCategoryModal() {
    // Create tabs
    populateCategoryTabs();
    
    // Create category groups
    populateCategoryGroups();
}

function populateCategoryTabs() {
    categoryTabs.innerHTML = '';
    
    // Create tabs for both category types
    const buyingBehaviorsTab = document.createElement('button');
    buyingBehaviorsTab.type = 'button';
    buyingBehaviorsTab.className = 'category-tab active';
    buyingBehaviorsTab.textContent = 'Buying Behaviors';
    buyingBehaviorsTab.dataset.group = 'buying_behaviors';
    
    const productCategoriesTab = document.createElement('button');
    productCategoriesTab.type = 'button';
    productCategoriesTab.className = 'category-tab';
    productCategoriesTab.textContent = 'Product Categories';
    productCategoriesTab.dataset.group = 'product_categories';
    
    // Handle tab clicks
    buyingBehaviorsTab.addEventListener('click', () => {
        switchToTab('buying_behaviors');
    });
    
    productCategoriesTab.addEventListener('click', () => {
        switchToTab('product_categories');
    });
    
    categoryTabs.appendChild(buyingBehaviorsTab);
    categoryTabs.appendChild(productCategoriesTab);
}

function populateCategoryGroups() {
    categoryList.innerHTML = '';

    // Create Buying Behaviors group
    const buyingBehaviorsHeader = document.createElement('div');
    buyingBehaviorsHeader.className = 'category-group-header';
    buyingBehaviorsHeader.textContent = 'Buying Behaviors';
    buyingBehaviorsHeader.dataset.group = 'buying_behaviors';
    categoryList.appendChild(buyingBehaviorsHeader);

    const buyingBehaviorsContainer = document.createElement('div');
    buyingBehaviorsContainer.className = 'category-group';
    buyingBehaviorsContainer.dataset.group = 'buying_behaviors';

    // Process buying behaviors
    CONFIG.BUYING_BEHAVIORS.forEach(category => {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'category-checkbox';
        checkboxContainer.dataset.category = category.label;
        checkboxContainer.dataset.group = 'buying_behaviors';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `buying-${category.value}`;
        checkbox.dataset.category = category.label;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = category.label;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        // Handle checkbox change
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                checkboxContainer.classList.add('selected');
            } else {
                checkboxContainer.classList.remove('selected');
            }
        });

        // Handle container click
        checkboxContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
                checkboxContainer.classList.add('selected');
            } else {
                checkboxContainer.classList.remove('selected');
            }
        });

        buyingBehaviorsContainer.appendChild(checkboxContainer);
    });

    categoryList.appendChild(buyingBehaviorsContainer);

    // Create Product Categories group
    const productCategoriesHeader = document.createElement('div');
    productCategoriesHeader.className = 'category-group-header';
    productCategoriesHeader.textContent = 'Product Categories';
    productCategoriesHeader.dataset.group = 'product_categories';
    productCategoriesHeader.style.display = 'none'; // Hidden by default
    categoryList.appendChild(productCategoriesHeader);

    const productCategoriesContainer = document.createElement('div');
    productCategoriesContainer.className = 'category-group';
    productCategoriesContainer.dataset.group = 'product_categories';
    productCategoriesContainer.style.display = 'none'; // Hidden by default

    // Process product categories
    CONFIG.PRODUCT_CATEGORIES.forEach(category => {
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'category-checkbox';
        checkboxContainer.dataset.category = category.label;
        checkboxContainer.dataset.group = 'product_categories';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
        checkbox.id = `product-${category.value}`;
        checkbox.dataset.category = category.label;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
        label.textContent = category.label;

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);

            // Handle checkbox change
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    checkboxContainer.classList.add('selected');
                } else {
                    checkboxContainer.classList.remove('selected');
                }
            });

            // Handle container click
            checkboxContainer.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                checkbox.checked = !checkbox.checked;
                if (checkbox.checked) {
                    checkboxContainer.classList.add('selected');
                } else {
                    checkboxContainer.classList.remove('selected');
                }
            });

        productCategoriesContainer.appendChild(checkboxContainer);
        });

    categoryList.appendChild(productCategoriesContainer);
}

function switchToTab(groupName) {
    // Update active tab
    const tabs = categoryTabs.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.group === groupName) {
            tab.classList.add('active');
        }
    });
    
    // Show/hide category groups
    const groupHeaders = categoryList.querySelectorAll('.category-group-header');
    const groupContainers = categoryList.querySelectorAll('.category-group');
    
    groupHeaders.forEach(header => {
        header.style.display = header.dataset.group === groupName ? 'block' : 'none';
    });
    
    groupContainers.forEach(container => {
        container.style.display = container.dataset.group === groupName ? 'block' : 'none';
    });
}

function showCategoryModal() {
    categoryModal.style.display = 'flex';
    // Set current selections
    updateModalSelections();
}

function hideCategoryModal() {
    categoryModal.style.display = 'none';
}

function filterCategoryModal(searchTerm) {
    const groups = categoryList.querySelectorAll('.category-group');
    const groupHeaders = categoryList.querySelectorAll('.category-group-header');
    const tabs = categoryTabs.querySelectorAll('.category-tab');
    const term = searchTerm.toLowerCase();
    
    // If searching, show all groups and hide tabs
    if (term !== '') {
        tabs.forEach(tab => tab.style.display = 'none');
        
        groups.forEach((group, index) => {
            const checkboxes = group.querySelectorAll('.category-checkbox');
            const groupHeader = groupHeaders[index];
            let hasVisibleItems = false;
            
            checkboxes.forEach(checkbox => {
                const text = checkbox.dataset.category.toLowerCase();
                if (text.includes(term)) {
                    checkbox.style.display = 'flex';
                    hasVisibleItems = true;
                } else {
                    checkbox.style.display = 'none';
                }
            });
            
            // Show/hide group header and container based on whether it has visible items
            if (hasVisibleItems) {
                groupHeader.style.display = 'block';
                group.style.display = 'block';
            } else {
                groupHeader.style.display = 'none';
                group.style.display = 'none';
            }
        });
    } else {
        // If not searching, show tabs and restore tab functionality
        tabs.forEach(tab => tab.style.display = 'block');
        
        // Reset to first tab
        const firstTab = tabs[0];
        if (firstTab) {
            switchToTab(firstTab.dataset.group);
        }
    }
}

function updateModalSelections() {
    const checkboxes = categoryList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const category = checkbox.dataset.category;
        checkbox.checked = window.selectedCategories.includes(category);
        const container = checkbox.closest('.category-checkbox');
        if (checkbox.checked) {
            container.classList.add('selected');
        } else {
            container.classList.remove('selected');
        }
    });
}

function applyCategorySelection() {
    const checkboxes = categoryList.querySelectorAll('input[type="checkbox"]:checked');
    window.selectedCategories = Array.from(checkboxes).map(checkbox => checkbox.dataset.category);
    
    updateSelectionDisplay('category', window.selectedCategories);
    updateSelectionButton('category', window.selectedCategories);
    updateSelectionHiddenInput('category', window.selectedCategories);
    hideCategoryModal();
}



function clearAllCategorySelections() {
    const checkboxes = categoryList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.category-checkbox').classList.remove('selected');
    });
}

function updateSelectedCategoriesDisplay() {
    selectedCategoriesContainer.innerHTML = '';
    
    window.selectedCategories.forEach(category => {
        const tag = document.createElement('div');
        tag.className = 'selected-category-tag';
        tag.innerHTML = `
            <i class="fas fa-tags"></i>
            <span>${category}</span>
            <button type="button" class="remove-category" onclick="removeCategory('${category}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        selectedCategoriesContainer.appendChild(tag);
    });
}

function updateHiddenInput() {
    categoryHidden.value = window.selectedCategories.join(', ');
}

function updateButtonText() {
    if (window.selectedCategories.length === 0) {
        categoryButtonText.textContent = 'Select Categories';
        categoryCount.style.display = 'none';
    } else {
        categoryButtonText.textContent = 'Categories Selected';
        categoryCount.textContent = `${window.selectedCategories.length} selected`;
        categoryCount.style.display = 'inline';
    }
}

function removeCategory(category) {
    const index = window.selectedCategories.indexOf(category);
    if (index > -1) {
        window.selectedCategories.splice(index, 1);
        updateSelectedCategoriesDisplay();
        updateHiddenInput();
        updateButtonText();
    }
}

function updateSliderTrack(slider) {
    const value = slider.value;
    const min = slider.min;
    const max = slider.max;
    const percentage = ((value - min) / (max - min)) * 100;
    
    // Update the track background to show the filled portion
    slider.style.background = `linear-gradient(to right, #000000 0%, #000000 ${percentage}%, transparent ${percentage}%, transparent 100%)`;
}

// Loading Screen Functions
const loadingMessages = [
    "<i class='fas fa-users'></i> Assembling your focus group cast...",
    "<i class='fas fa-dice'></i> Rolling dice for personality traits...",
    "<i class='fas fa-home'></i> Finding them suitable homes across America...",
    "<i class='fas fa-briefcase'></i> Assigning random jobs they'll complain about...",
    "<i class='fas fa-baby'></i> Deciding who gets kids (sorry in advance)...",
    "<i class='fas fa-paw'></i> Some are getting surprise pets...",
    "<i class='fas fa-dollar-sign'></i> Calculating incomes (nobody's getting rich)...",
    "<i class='fas fa-shopping-cart'></i> Teaching them how to shop online...",
    "<i class='fas fa-coffee'></i> Brewing coffee for the professionals...",
    "<i class='fas fa-envelope'></i> Setting up email accounts...",
    "<i class='fas fa-graduation-cap'></i> Assigning educational backgrounds...",
    "<i class='fas fa-house-user'></i> Finding suitable living arrangements...",
    "<i class='fas fa-heart'></i> Playing matchmaker for the married ones...",
    "<i class='fas fa-leaf'></i> Making some of them eco-conscious...",
    "<i class='fas fa-cat'></i> Distributing cats to cat people...",
    "<i class='fas fa-dragon'></i> Finding reptiles for the brave ones...",
    "<i class='fas fa-shopping-bag'></i> Creating shopping addictions...",
    "<i class='fas fa-mobile-alt'></i> Teaching them to argue about electronics...",
    "<i class='fas fa-tshirt'></i> Updating their fashion sense...",
    "<i class='fas fa-hammer'></i> Renovating their imaginary homes...",
    "<i class='fas fa-seedling'></i> Planting gardens they'll never water...",
    "<i class='fas fa-stethoscope'></i> Scheduling their annual checkups...",
    "<i class='fas fa-car'></i> Picking cars they can't afford...",
    "<i class='fas fa-magic'></i> Adding quirky personality traits...",
    "<i class='fas fa-chart-bar'></i> Making sure they're statistically diverse...",
    "<i class='fas fa-trophy'></i> Almost done with this circus..."
];

let messageInterval;
let currentMessageIndex = 0;

function generateDynamicLoadingMessages(selectedCategories, sessionType, sessionName) {
    const messages = [];
    
    // Base messages for different session types
    const sessionTypeMessages = {
        'Product Research': [
            '<i class="fas fa-flask"></i> Mixing up the perfect product testers...',
            '<i class="fas fa-microscope"></i> Analyzing consumer behavior patterns...',
            '<i class="fas fa-lightbulb"></i> Finding people who actually read product manuals...',
            '<i class="fas fa-chart-line"></i> Crunching numbers while participants crunch snacks...',
            '<i class="fas fa-users"></i> Assembling the most opinionated focus group ever...'
        ],
        'Market Research': [
            '<i class="fas fa-search"></i> Hunting down the most vocal critics and fans...',
            '<i class="fas fa-bullseye"></i> Targeting the perfect demographic mix...',
            '<i class="fas fa-compass"></i> Navigating through market trends and preferences...',
            '<i class="fas fa-telescope"></i> Scoping out the competition through participant eyes...',
            '<i class="fas fa-radar"></i> Detecting hidden consumer insights...'
        ],
        'Brand Perception': [
            '<i class="fas fa-palette"></i> Painting the perfect brand image in participants\' minds...',
            '<i class="fas fa-crown"></i> Finding people who actually care about brand loyalty...',
            '<i class="fas fa-eye"></i> Teaching participants to see brands with fresh eyes...',
            '<i class="fas fa-magic"></i> Casting spells to reveal true brand feelings...',
            '<i class="fas fa-star"></i> Searching for the brand ambassadors of tomorrow...'
        ]
    };
    
    // Category-specific messages
    const categoryMessages = {
        'general': [
            '<i class="fas fa-random"></i> Randomly selecting the most random people...',
            '<i class="fas fa-dice"></i> Rolling the dice on participant selection...'
        ],
        'online': [
            '<i class="fas fa-wifi"></i> Connecting to the digital natives...',
            '<i class="fas fa-laptop"></i> Finding people who live on the internet...'
        ],
        'budget_conscious': [
            '<i class="fas fa-piggy-bank"></i> Counting pennies with the frugal experts...',
            '<i class="fas fa-calculator"></i> Finding people who actually use coupons...'
        ],
        'luxury': [
            '<i class="fas fa-diamond"></i> Polishing the diamond-encrusted participants...',
            '<i class="fas fa-champagne-glasses"></i> Pouring champagne for the luxury lovers...'
        ],
        'eco_conscious': [
            '<i class="fas fa-leaf"></i> Growing organic, eco-friendly participants...',
            '<i class="fas fa-recycle"></i> Recycling old participants into new insights...'
        ],
        'impulse_buyers': [
            '<i class="fas fa-bolt"></i> Lightning-fast decision makers incoming...',
            '<i class="fas fa-fire"></i> Finding people who buy first, think later...'
        ],
        'research_heavy': [
            '<i class="fas fa-book"></i> Loading the research nerds...',
            '<i class="fas fa-magnifying-glass"></i> Finding people who read every review...'
        ],
        'brand_loyal': [
            '<i class="fas fa-heart"></i> Matching up the brand fanatics...',
            '<i class="fas fa-ribbon"></i> Tying loyalty ribbons around participants...'
        ],
        'deal_seekers': [
            '<i class="fas fa-tags"></i> Tagging the ultimate bargain hunters...',
            '<i class="fas fa-percentage"></i> Calculating the best deals for participants...'
        ],
        'electronics': [
            '<i class="fas fa-microchip"></i> Processing the tech-savvy participants...',
            '<i class="fas fa-robot"></i> Programming the gadget gurus...'
        ],
        'fashion_apparel': [
            '<i class="fas fa-tshirt"></i> Styling the fashion-forward participants...',
            '<i class="fas fa-mirror"></i> Finding people who check their reflection constantly...'
        ],
        'grocery_household': [
            '<i class="fas fa-shopping-cart"></i> Filling carts with household experts...',
            '<i class="fas fa-home"></i> Finding people who actually enjoy grocery shopping...'
        ],
        'beauty_personal_care': [
            '<i class="fas fa-spa"></i> Pampering the beauty enthusiasts...',
            '<i class="fas fa-magic-wand-sparkles"></i> Casting beauty spells on participants...'
        ],
        'baby_kid_products': [
            '<i class="fas fa-baby"></i> Diapering the parenting experts...',
            '<i class="fas fa-puzzle-piece"></i> Piecing together the perfect parent participants...'
        ],
        'home_improvement': [
            '<i class="fas fa-hammer"></i> Hammering out the DIY experts...',
            '<i class="fas fa-tools"></i> Tooling up the home improvement gurus...'
        ],
        'furniture_decor': [
            '<i class="fas fa-couch"></i> Sofa-king comfortable with furniture experts...',
            '<i class="fas fa-paintbrush"></i> Painting the perfect decor participants...'
        ],
        'garden_outdoor': [
            '<i class="fas fa-seedling"></i> Growing the green-thumb participants...',
            '<i class="fas fa-sun"></i> Basking in the outdoor enthusiasts...'
        ],
        'office_business': [
            '<i class="fas fa-briefcase"></i> Briefing the business professionals...',
            '<i class="fas fa-chart-bar"></i> Charting the corporate participants...'
        ],
        'health_medical': [
            '<i class="fas fa-stethoscope"></i> Diagnosing the health-conscious participants...',
            '<i class="fas fa-pills"></i> Prescribing the perfect health experts...'
        ],
        'dogs': [
            '<i class="fas fa-dog"></i> Fetching the dog-loving participants...',
            '<i class="fas fa-bone"></i> Burying treats for the canine experts...'
        ],
        'cats': [
            '<i class="fas fa-cat"></i> Purring up the cat enthusiasts...',
            '<i class="fas fa-mouse"></i> Chasing the feline experts...'
        ],
        'birds': [
            '<i class="fas fa-dove"></i> Soaring with the bird lovers...',
            '<i class="fas fa-feather"></i> Feathering the avian experts...'
        ],
        'fish': [
            '<i class="fas fa-fish"></i> Swimming with the aquatic enthusiasts...',
            '<i class="fas fa-water"></i> Diving deep with fish experts...'
        ],
        'small_animals': [
            '<i class="fas fa-hamster"></i> Wheeling in the small pet experts...',
            '<i class="fas fa-carrot"></i> Feeding the tiny animal enthusiasts...'
        ],
        'reptiles': [
            '<i class="fas fa-dragon"></i> Scaly participants incoming...',
            '<i class="fas fa-snake"></i> Slithering in the reptile experts...'
        ],
        'automotive': [
            '<i class="fas fa-car"></i> Revving up the car enthusiasts...',
            '<i class="fas fa-wrench"></i> Tuning up the automotive experts...'
        ],
        'sports_fitness': [
            '<i class="fas fa-dumbbell"></i> Pumping up the fitness fanatics...',
            '<i class="fas fa-trophy"></i> Awarding medals to sports experts...'
        ],
        'entertainment': [
            '<i class="fas fa-film"></i> Rolling out the entertainment buffs...',
            '<i class="fas fa-music"></i> Harmonizing with the media experts...'
        ],
        'travel_hospitality': [
            '<i class="fas fa-plane"></i> Boarding the travel enthusiasts...',
            '<i class="fas fa-hotel"></i> Checking in the hospitality experts...'
        ],
        'food_beverage': [
            '<i class="fas fa-utensils"></i> Cooking up the foodie participants...',
            '<i class="fas fa-wine-glass"></i> Pouring the beverage experts...'
        ],
        'financial_services': [
            '<i class="fas fa-coins"></i> Counting the money-savvy participants...',
            '<i class="fas fa-chart-pie"></i> Slicing up the financial experts...'
        ],
        'education_learning': [
            '<i class="fas fa-graduation-cap"></i> Graduating the learning enthusiasts...',
            '<i class="fas fa-chalkboard"></i> Teaching the education experts...'
        ],
        'hobbies_crafts': [
            '<i class="fas fa-palette"></i> Painting the creative participants...',
            '<i class="fas fa-scissors"></i> Cutting up the craft experts...'
        ],
        'gifts_special_occasions': [
            '<i class="fas fa-gift"></i> Wrapping up the gift-giving experts...',
            '<i class="fas fa-birthday-cake"></i> Celebrating with party planners...'
        ],
        'subscription_services': [
            '<i class="fas fa-sync"></i> Syncing up the subscription lovers...',
            '<i class="fas fa-calendar"></i> Scheduling the recurring service experts...'
        ]
    };
    
    // Add session type messages
    if (sessionTypeMessages[sessionType]) {
        messages.push(...sessionTypeMessages[sessionType]);
    }
    
    // Add category-specific messages
    selectedCategories.forEach(category => {
        const cleanCategory = category.toLowerCase().replace(/[^a-z]/g, '_');
        if (categoryMessages[cleanCategory]) {
            messages.push(...categoryMessages[cleanCategory]);
        }
    });
    
    // Add some generic funny messages
    const genericMessages = [
        '<i class="fas fa-cog"></i> Turning the gears of participant selection...',
        '<i class="fas fa-database"></i> Querying the participant database...',
        '<i class="fas fa-network-wired"></i> Networking with potential participants...',
        '<i class="fas fa-brain"></i> Brainstorming the perfect participant mix...',
        '<i class="fas fa-puzzle-piece"></i> Piecing together the ideal focus group...',
        '<i class="fas fa-magic"></i> Casting spells to find the right people...',
        '<i class="fas fa-rocket"></i> Launching participant recruitment...',
        '<i class="fas fa-satellite"></i> Scanning for the perfect participants...',
        '<i class="fas fa-microscope"></i> Examining participant profiles under a microscope...',
        '<i class="fas fa-telescope"></i> Zooming in on the ideal candidates...',
        '<i class="fas fa-compass"></i> Navigating to the perfect participant pool...',
        '<i class="fas fa-map"></i> Mapping out the participant landscape...',
        '<i class="fas fa-filter"></i> Filtering through thousands of profiles...',
        '<i class="fas fa-sort"></i> Sorting participants by relevance...',
        '<i class="fas fa-check-circle"></i> Validating participant qualifications...',
        '<i class="fas fa-clock"></i> Timing the perfect participant selection...',
        '<i class="fas fa-balance-scale"></i> Balancing the participant demographics...',
        '<i class="fas fa-shield-alt"></i> Securing the most qualified participants...',
        '<i class="fas fa-award"></i> Awarding participation to the best candidates...',
        '<i class="fas fa-star"></i> Star-rating the participant pool...'
    ];
    
    messages.push(...genericMessages);
    
    // Shuffle the messages for variety
    return shuffleArray(messages);
}

function showLoadingScreen(selectedCategories = [], sessionType = '', sessionName = '') {
    console.log('showLoadingScreen called with categories:', selectedCategories, 'sessionType:', sessionType);
    
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.id = 'loadingOverlay';
    
    // Generate dynamic funny messages based on session type and categories
    const messages = generateDynamicLoadingMessages(selectedCategories, sessionType, sessionName);
    
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <h2>Creating Your Focus Group</h2>
            <p class="loading-message" id="loadingMessage">${messages[0]}</p>
            
            <div class="processing-time-notice">
                <p>This process can take up to 4 minutes. Please don't close this window.</p>
            </div>
        </div>
        <div class="floating-particles">
            ${Array.from({length: 20}, (_, i) => 
                `<div class="particle" style="--delay: ${i * 0.5}s; --duration: ${3 + i * 0.2}s; --size: ${8 + i * 4}px;"></div>`
            ).join('')}
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    console.log('Loading overlay added to DOM');
    
    const loadingMessageElement = document.getElementById('loadingMessage');
    let currentMessageIndex = 0;
    
    // Dynamic rotation with longer display time for longer messages
    const messageInterval = setInterval(() => {
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        const currentMessage = messages[currentMessageIndex];
        
        // Calculate reading time for longer messages (minimum 8 seconds, up to 15 seconds)
        const readingTime = Math.max(8000, Math.min(15000, currentMessage.length * 50)); // 50ms per character
        
        // Fade out current message
        loadingMessageElement.style.opacity = '0';
        
        setTimeout(() => {
            loadingMessageElement.innerHTML = currentMessage;
            loadingMessageElement.style.opacity = '1';
        }, 300);
        
    }, 8000); // Start with 8 seconds for longer messages
    
    // Store interval ID for cleanup
    loadingOverlay.dataset.messageInterval = messageInterval;
}

function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        // Clear the message interval if it exists
        const intervalId = loadingOverlay.dataset.messageInterval;
        if (intervalId) {
            clearInterval(parseInt(intervalId));
        }
        
        // Clear the timeout if it exists
        const timeoutId = loadingOverlay.dataset.timeoutId;
        if (timeoutId) {
            clearTimeout(parseInt(timeoutId));
        }
        

        
        loadingOverlay.remove();
    }
}

function showResponseScreen(result) {
    // Create response container if it doesn't exist
    if (!document.getElementById('responseContainer')) {
        const responseContainer = document.createElement('div');
        responseContainer.id = 'responseContainer';
        responseContainer.className = 'response-container';
        document.body.appendChild(responseContainer);
    }
    
    const responseContainer = document.getElementById('responseContainer');
    
    // Format categories for display
    const formattedCategories = result.categories.map(cat => 
        cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
    
    responseContainer.innerHTML = `
        <div class="response-content">
            <h2><i class="fas fa-check-circle"></i> Participants Ready!</h2>
            
            <div class="summary-cards">
                <div class="summary-card">
                    <h3>Total Requested</h3>
                    <p class="big-number">${result.total_count}</p>
                </div>
                
                <div class="summary-card">
                    <h3>Already Existed</h3>
                    <p class="big-number">${result.existing_count}</p>
                </div>
                
                <div class="summary-card">
                    <h3>Newly Created</h3>
                    <p class="big-number">${result.created_count}</p>
                </div>
            </div>
            
            <div class="categories-display">
                <h3>Categories:</h3>
                <div class="category-tags">
                    ${formattedCategories.map(cat => 
                        `<span class="category-tag">${cat}</span>`
                    ).join('')}
                </div>
            </div>
            
            <p class="summary-message">${result.message}</p>
            
            <button class="btn btn-primary" onclick="closeResponseScreen()">
                <i class="fas fa-plus"></i> Start Another Focus Group
            </button>
        </div>
    `;
    
    responseContainer.style.display = 'flex';
    
    // Reset form
    focusGroupForm.reset();
    
    // Clear selected categories
    window.selectedCategories = [];
    updateSelectedCategoriesDisplay();
    updateHiddenInput();
    updateButtonText();
}

function showErrorScreen(errorMessage) {
    // Create error container if it doesn't exist
    if (!document.getElementById('errorContainer')) {
        const errorContainer = document.createElement('div');
        errorContainer.id = 'errorContainer';
        errorContainer.className = 'error-container';
        document.body.appendChild(errorContainer);
    }
    
    const errorContainer = document.getElementById('errorContainer');
    
    errorContainer.innerHTML = `
        <div class="error-content">
            <h2><i class="fas fa-exclamation-triangle"></i> Oops! Something went wrong</h2>
            <p>${errorMessage}</p>
            <button class="btn btn-primary" onclick="closeErrorScreen()"><i class="fas fa-redo"></i> Try Again</button>
        </div>
    `;
    
    errorContainer.style.display = 'flex';
}

function closeResponseScreen() {
    const responseContainer = document.getElementById('responseContainer');
    if (responseContainer) {
        responseContainer.style.display = 'none';
    }
}

function closeErrorScreen() {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.style.display = 'none';
    }
}

// File download helper functions
function getFilenameFromDisposition(contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
        return filenameMatch[1].replace(/['"]/g, '');
    }
    return null;
}

function showFileDownloadScreen(data) {
    // Create file download container if it doesn't exist
    if (!document.getElementById('fileDownloadContainer')) {
        const fileDownloadContainer = document.createElement('div');
        fileDownloadContainer.id = 'fileDownloadContainer';
        fileDownloadContainer.className = 'file-download-container';
        document.body.appendChild(fileDownloadContainer);
    }
    
    const fileDownloadContainer = document.getElementById('fileDownloadContainer');
    
    // Format categories for display
    const formattedCategories = data.categories.map(cat => 
        cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
    
    fileDownloadContainer.innerHTML = `
        <div class="file-download-content">
            <h2><i class="fas fa-file-download"></i> Focus Group Report Ready!</h2>
            
            <div class="download-summary">
                <div class="summary-card">
                    <h3>Session Name</h3>
                    <p class="session-name">${data.sessionName}</p>
                </div>
                
                <div class="summary-card">
                    <h3>Participants</h3>
                    <p class="big-number">${data.totalCount}</p>
                </div>
                
                <div class="summary-card">
                    <h3>File Name</h3>
                    <p class="filename">${data.filename}</p>
                </div>
            </div>
            
            <div class="categories-display">
                <h3>Categories:</h3>
                <div class="category-tags">
                    ${formattedCategories.map(cat => 
                        `<span class="category-tag">${cat}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="download-actions">
                <button class="btn btn-primary download-btn" onclick="downloadFile('${data.filename}', data.blob)">
                    <i class="fas fa-download"></i> Download Report
                </button>
                
                                    <button class="btn btn-secondary" onclick="previewFile(data.blob, data.filename)">
                    <i class="fas fa-eye"></i> Preview Content
                </button>
            </div>
            
            <button class="btn btn-outline" onclick="closeFileDownloadScreen()">
                <i class="fas fa-plus"></i> Start Another Focus Group
            </button>
        </div>
    `;
    
    // Store blob data globally for download function
    window.currentDownloadBlob = data.blob;
    
    fileDownloadContainer.style.display = 'flex';
    
    // Reset form
    focusGroupForm.reset();
    
    // Clear selected categories
    window.selectedCategories = [];
    updateSelectedCategoriesDisplay();
    updateHiddenInput();
    updateButtonText();
}

function downloadFile(filename, blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function previewFile(blob, filename) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        
        // Create preview modal
        const previewModal = document.createElement('div');
        previewModal.className = 'preview-modal';
        previewModal.innerHTML = `
            <div class="preview-content">
                <div class="preview-header">
                    <h3><i class="fas fa-file-text"></i> File Preview</h3>
                    <button class="close-preview" onclick="closePreviewModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="preview-body">
                    <pre>${content}</pre>
                </div>
                <div class="preview-footer">
                    <button class="btn btn-primary" onclick="downloadFile('${filename}', window.currentDownloadBlob)">
                        <i class="fas fa-download"></i> Download File
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(previewModal);
        previewModal.style.display = 'flex';
    };
    reader.readAsText(blob);
}

function closePreviewModal() {
    const previewModal = document.querySelector('.preview-modal');
    if (previewModal) {
        previewModal.remove();
    }
}

function closeFileDownloadScreen() {
    const fileDownloadContainer = document.getElementById('fileDownloadContainer');
    if (fileDownloadContainer) {
        fileDownloadContainer.style.display = 'none';
    }
    // Clean up blob data
    if (window.currentDownloadBlob) {
        window.URL.revokeObjectURL(window.currentDownloadBlob);
        window.currentDownloadBlob = null;
    }
}



// Add some additional validation
document.addEventListener('DOMContentLoaded', function() {
    // Prevent form submission on Enter key in textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                // Allow Ctrl+Enter to submit
                return;
            }
            if (e.key === 'Enter') {
                // Prevent default Enter behavior in textareas
                e.stopPropagation();
            }
        });
    });
    
    // Slider validation is handled by the min/max attributes
});

// Language switching functions
function initializeLanguage() {
    // Set default language
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener('change', handleLanguageChange);
        updateLanguage();
    }
}

function handleLanguageChange() {
    currentLanguage = languageSelect.value;
    updateLanguage();
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', currentLanguage);
}

function updateLanguage() {
    const translations = CONFIG.TRANSLATIONS[currentLanguage];
    if (!translations) return;

    // Update main header
    const headerTitle = document.querySelector('.app-header h1');
    if (headerTitle) {
        headerTitle.textContent = translations.focusGroupSystem;
    }

    // Update logout button
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.innerHTML = `<i class="fas fa-sign-out-alt"></i> ${translations.logout}`;
    }

    // Update form labels and placeholders
    updateFormTexts(translations);
    
    // Update button texts
    updateButtonTexts(translations);
}

function updateFormTexts(translations) {
    // Session type
    const sessionTypeLabel = document.querySelector('label[for="sessionType"]');
    if (sessionTypeLabel) {
        sessionTypeLabel.textContent = translations.sessionType;
    }
    
    const sessionTypeSelect = document.getElementById('sessionType');
    if (sessionTypeSelect && sessionTypeSelect.options.length > 0) {
        sessionTypeSelect.options[0].textContent = translations.selectSessionType;
    }

    // Session name
    const sessionNameLabel = document.querySelector('label[for="sessionName"]');
    if (sessionNameLabel) {
        sessionNameLabel.textContent = translations.sessionName;
    }
    
    const sessionNameInput = document.getElementById('sessionName');
    if (sessionNameInput) {
        sessionNameInput.placeholder = translations.enterSessionName;
    }

    // Number of participants
    const participantsLabel = document.querySelector('label[for="numberOfParticipants"]');
    if (participantsLabel) {
        participantsLabel.innerHTML = `${translations.numberOfParticipants} <span id="numberOfParticipantsValue">12</span>`;
    }

    // Product fields
    const productNameLabel = document.querySelector('label[for="productName"]');
    if (productNameLabel) {
        productNameLabel.textContent = translations.productName;
    }
    
    const productNameInput = document.getElementById('productName');
    if (productNameInput) {
        productNameInput.placeholder = translations.enterProductName;
    }

    const productDescLabel = document.querySelector('label[for="productDescription"]');
    if (productDescLabel) {
        productDescLabel.textContent = translations.productDescription;
    }
    
    const productDescTextarea = document.getElementById('productDescription');
    if (productDescTextarea) {
        productDescTextarea.placeholder = translations.describeProduct;
    }

    const productCatLabel = document.querySelector('label[for="productCategory"]');
    if (productCatLabel) {
        productCatLabel.textContent = translations.productCategory;
    }
    
    const productCatInput = document.getElementById('productCategory');
    if (productCatInput) {
        productCatInput.placeholder = translations.productCategoryExample;
    }
}

function updateButtonTexts(translations) {
    // Main form button
    const startButton = document.querySelector('#focusGroupForm .btn-primary');
    if (startButton) {
        startButton.innerHTML = `<i class="fas fa-play"></i> ${translations.startFocusGroup}`;
    }

    // Category button
    const categoryButton = document.getElementById('categoryButtonText');
    if (categoryButton) {
        categoryButton.textContent = translations.selectCategories;
    }

    // Gender button
    const genderButton = document.getElementById('genderButtonText');
    if (genderButton) {
        genderButton.textContent = translations.selectGender;
    }

    // Age button
    const ageButton = document.getElementById('ageButtonText');
    if (ageButton) {
        ageButton.textContent = translations.selectAgeRange;
    }

    // Income button
    const incomeButton = document.getElementById('incomeButtonText');
    if (incomeButton) {
        incomeButton.textContent = translations.selectIncomeRange;
    }

    // Marital button
    const maritalButton = document.getElementById('maritalButtonText');
    if (maritalButton) {
        maritalButton.textContent = translations.selectMaritalStatus;
    }

    // Children button
    const childrenButton = document.getElementById('childrenButtonText');
    if (childrenButton) {
        childrenButton.textContent = translations.selectChildrenStatus;
    }

    // Education button
    const educationButton = document.getElementById('educationButtonText');
    if (educationButton) {
        educationButton.textContent = translations.selectEducationLevel;
    }

    // Race button
    const raceButton = document.getElementById('raceButtonText');
    if (raceButton) {
        raceButton.textContent = translations.selectRace;
    }
}

// Load saved language preference on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && languageSelect) {
        currentLanguage = savedLanguage;
        languageSelect.value = savedLanguage;
        updateLanguage();
    }
});

// Initialize all selection buttons with default text
function initializeSelectionButtons() {
    // Initialize each selection type with empty arrays and default button text
    const selectionTypes = ['category', 'gender', 'age', 'income', 'marital', 'children', 'education', 'race'];
    
    selectionTypes.forEach(type => {
        // Initialize the selected items array
        let arrayName;
        if (type === 'marital') arrayName = 'selectedMaritals';
        else if (type === 'children') arrayName = 'selectedChildren';
        else if (type === 'education') arrayName = 'selectedEducations';
        else if (type === 'race') arrayName = 'selectedRaces';
        else arrayName = 'selected' + type.charAt(0).toUpperCase() + type.slice(1) + 's';
        
        window[arrayName] = [];
        
        // Update button text to show default "Select..." text
        updateSelectionButton(type, []);
        updateSelectionDisplay(type, []);
        updateSelectionHiddenInput(type, []);
    });
    
    console.log('All selection buttons initialized with default text');
}

function initializeSlider() {
    console.log('Initializing slider...');
    
    // Get fresh references to the elements
    const slider = document.getElementById('numberOfParticipants');
    const valueDisplay = document.getElementById('numberOfParticipantsValue');
    
    console.log('Slider elements found:', {
        slider: slider,
        valueDisplay: valueDisplay,
        sliderFound: !!slider,
        valueDisplayFound: !!valueDisplay
    });
    
    if (slider && valueDisplay) {
        // Remove any existing event listeners by cloning the element
        const newSlider = slider.cloneNode(true);
        slider.parentNode.replaceChild(newSlider, slider);
        
        // Get the new reference
        const freshSlider = document.getElementById('numberOfParticipants');
        
        // Initialize slider value display
        valueDisplay.textContent = freshSlider.value;
        console.log('Initial slider value set to:', freshSlider.value);
        
        // Update slider track on initialization
        updateSliderTrack(freshSlider);
        
        // Add event listeners
        freshSlider.addEventListener('input', function() {
            const newValue = this.value;
            valueDisplay.textContent = newValue;
            updateSliderTrack(this);
            console.log('Slider input event - value changed to:', newValue);
            console.log('Value display element textContent:', valueDisplay.textContent);
        });
        
        freshSlider.addEventListener('change', function() {
            const newValue = this.value;
            valueDisplay.textContent = newValue;
            updateSliderTrack(this);
            console.log('Slider change event - value changed to:', newValue);
            console.log('Value display element textContent:', valueDisplay.textContent);
        });
        
        console.log('Slider event listeners added successfully');
        console.log('Initial state - Slider value:', freshSlider.value, 'Display value:', valueDisplay.textContent);
    } else {
        console.error('Slider elements not found during initialization:', {
            slider: !!slider,
            valueDisplay: !!valueDisplay
        });
    }
}

// GitHub Pages Notice Functions
function showGitHubPagesNotice() {
    const notice = document.getElementById('githubPagesNotice');
    if (notice) {
        notice.style.display = 'block';
    }
}

function hideGitHubPagesNotice() {
    const notice = document.getElementById('githubPagesNotice');
    if (notice) {
        notice.style.display = 'none';
    }
}








