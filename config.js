// Production Configuration for Focus Group System
// This file contains settings optimized for live server deployment

const CONFIG = {
    // Webhook URL for creating focus groups (no longer creating participants)
    WEBHOOK_URL: "https://creativventures.app.n8n.cloud/webhook/focus-group-ai",
    
    // CORS Proxy URLs (multiple options for redundancy)
    CORS_PROXY_URLS: [
        "https://api.allorigins.win/raw?url=",
        "https://thingproxy.freeboard.io/fetch/",
        "https://cors.bridged.cc/",
        "https://api.codetabs.com/v1/proxy?quest=",
        "https://cors-anywhere.herokuapp.com/",
        "https://cors.io/?",
        "https://jsonp.afeld.me/?url=",
        "https://api.codetabs.com/v1/proxy?quest="
    ],
    
    // Use CORS proxy for development (disabled - n8n webhook now has CORS headers)
    USE_CORS_PROXY: false,
    
    // Production settings
    IS_PRODUCTION: true, // Set to true when deployed to live server
    
    // Authentication
    PASSWORD: "focusgroup2024", // Password for accessing the system
    
    // Session types for the Run Focus Group form (Market Research is default)
    SESSION_TYPES: [
        { value: "market_research", label: "Market Research" },
        { value: "product_research", label: "Product Research" },
        { value: "user_experience", label: "User Experience", disabled: true },
        { value: "customer_feedback", label: "Customer Feedback", disabled: true },
        { value: "brand_perception", label: "Brand Perception" },
        { value: "competitive_analysis", label: "Competitive Analysis", disabled: true },
        { value: "advertising_testing", label: "Advertising Testing", disabled: true },
        { value: "pricing_research", label: "Pricing Research", disabled: true },
        { value: "concept_validation", label: "Concept Validation", disabled: true },
        { value: "satisfaction_survey", label: "Satisfaction Survey", disabled: true }
    ],
    
    // Buying behaviors for participant selection
    BUYING_BEHAVIORS: [
        { value: "general", label: "General" },
        { value: "online", label: "Online" },
        { value: "budget_conscious", label: "Budget-Conscious" },
        { value: "luxury", label: "Luxury" },
        { value: "eco_conscious", label: "Eco-Conscious" },
        { value: "impulse_buyer", label: "Impulse Buyer" },
        { value: "research_heavy", label: "Research Heavy" },
        { value: "brand_loyal", label: "Brand Loyal" },
        { value: "deal_seekers", label: "Deal Seekers" }
    ],
    
    // Product categories for participant selection
    PRODUCT_CATEGORIES: [
        { value: "fashion_apparel", label: "Fashion and Apparel" },
        { value: "grocery_household", label: "Grocery and Household" },
        { value: "beauty_personal_care", label: "Beauty and Personal Care" },
        { value: "baby_kid_products", label: "Baby and Kid Products" },
        { value: "home_improvement", label: "Home Improvement" },
        { value: "furniture_decor", label: "Furniture and Decor" },
        { value: "garden_outdoor", label: "Garden and Outdoor" },
        { value: "office_business", label: "Office and Business" },
        { value: "dogs", label: "Dogs" },
        { value: "cats", label: "Cats" },
        { value: "birds", label: "Birds" },
        { value: "fish", label: "Fish" },
        { value: "small_animals", label: "Small Animals" },
        { value: "reptiles", label: "Reptiles" },
        { value: "automotive", label: "Automotive" },
        { value: "sports_fitness", label: "Sports and Fitness" },
        { value: "entertainment", label: "Entertainment" },
        { value: "travel_hospitality", label: "Travel & Hospitality" },
        { value: "food_beverage", label: "Food and Beverage" },
        { value: "financial_services", label: "Financial Services" },
        { value: "education_learning", label: "Education and Learning" },
        { value: "hobbies_crafts", label: "Hobbies and Crafts" },
        { value: "gifts_special_occasions", label: "Gifts and Special Occasions" }
    ],
    
    // Default form values
    DEFAULT_VALUES: {
        session_name: "",
        session_type: "market_research",
        buying_behaviors: ["general"],
        product_categories: ["fashion_apparel"],
        number_of_participants: 10,
        session_duration: 60,
        incentive_amount: 50,
        session_date: "",
        session_time: "",
        research_objectives: "",
        specific_questions: "",
        additional_requirements: ""
    },
    
    // Form validation rules
    VALIDATION: {
        session_name: {
            required: true,
            minLength: 3,
            maxLength: 100
        },
        categories: {
            required: true,
            minCount: 1,
            maxCount: 5
        },
        number_of_participants: {
            required: true,
            min: 5,
            max: 50
        },
        session_duration: {
            required: true,
            min: 30,
            max: 180
        },
        incentive_amount: {
            required: true,
            min: 10,
            max: 500
        },
        session_date: {
            required: true,
            futureDate: true
        },
        session_time: {
            required: true
        },
        research_objectives: {
            required: true,
            minLength: 20,
            maxLength: 1000
        }
    },
    
    // API endpoints (if you add a backend later)
    API_ENDPOINTS: {
        // These can be used if you add a backend API later
        focus_groups: "/api/focus-groups",
        participants: "/api/participants",
        sessions: "/api/sessions"
    },
    
    // UI Configuration
    UI: {
        // Loading screen configuration
        loading: {
            minDisplayTime: 2000, // Minimum time to show loading screen (ms)
            messageRotationInterval: 8000, // How often to rotate messages (ms)
            maxMessageLength: 500 // Maximum characters per message
        },
        
        // Animation settings
        animations: {
            fadeInDuration: 300,
            fadeOutDuration: 300,
            slideInDuration: 400,
            slideOutDuration: 400
        },
        
        // Responsive breakpoints
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        }
    },
    
    // Error messages
    ERROR_MESSAGES: {
        network: {
            cors: "CORS restrictions are preventing the request. This is common when the webhook server doesn't allow requests from your domain.",
            timeout: "The request timed out. The n8n workflow may be taking longer than expected.",
            connection: "Unable to connect to the webhook server. Please check your internet connection and try again.",
            server: "The webhook server returned an error. Please try again later.",
            unknown: "An unexpected error occurred. Please try again."
        },
        validation: {
            required: "This field is required.",
            minLength: "This field must be at least {min} characters long.",
            maxLength: "This field must be no more than {max} characters long.",
            min: "This value must be at least {min}.",
            max: "This value must be no more than {max}.",
            futureDate: "Please select a future date.",
            invalidFormat: "Please enter a valid format."
        }
    },
    
    // Success messages
    SUCCESS_MESSAGES: {
        focus_group_created: "Focus group created successfully!",
        participants_added: "Participants added successfully!",
        session_scheduled: "Session scheduled successfully!",
        file_downloaded: "File downloaded successfully!"
    },
    
    // Development/Production flags
    DEBUG: false, // Set to false in production
    LOG_LEVEL: "error", // "debug", "info", "warn", "error"
    
    // Feature flags
    FEATURES: {
        fileDownload: true,
        previewModal: true,
        dynamicMessages: true,
        corsProxy: false, // Disabled in production
        testButtons: false // Disabled in production
    },
    
    // Language translations
    TRANSLATIONS: {
        en: {
            focusGroupSystem: "Focus Group System",
            logout: "Logout",
            sessionType: "Session Type:",
            selectSessionType: "Select session type",
            sessionName: "Session Name:",
            enterSessionName: "Enter session name...",
            numberOfParticipants: "Number of Participants:",
            productName: "Product Name:",
            enterProductName: "Enter product name...",
            productDescription: "Product Description:",
            describeProduct: "Describe the product...",
            productCategory: "Product Category:",
            productCategoryExample: "e.g., Electronics, Fashion, Food...",
            startFocusGroup: "Start Focus Group",
            selectCategories: "Select Categories",
            selectGender: "Select Gender",
            selectAgeRange: "Select Age Range",
            selectIncomeRange: "Select Income Range",
            selectMaritalStatus: "Select Marital Status",
            selectChildrenStatus: "Select Children Status",
            selectEducationLevel: "Select Education Level",
            selectRace: "Select Race"
        },
        "zh-cn": {
            focusGroupSystem: "焦点小组系统",
            logout: "登出",
            sessionType: "会议类型:",
            selectSessionType: "选择会议类型",
            sessionName: "会议名称:",
            enterSessionName: "输入会议名称...",
            numberOfParticipants: "参与者人数:",
            productName: "产品名称:",
            enterProductName: "输入产品名称...",
            productDescription: "产品描述:",
            describeProduct: "描述产品...",
            productCategory: "产品类别:",
            productCategoryExample: "例如：电子产品、时尚、食品...",
            startFocusGroup: "开始焦点小组",
            selectCategories: "选择类别",
            selectGender: "选择性别",
            selectAgeRange: "选择年龄范围",
            selectIncomeRange: "选择收入范围",
            selectMaritalStatus: "选择婚姻状况",
            selectChildrenStatus: "选择子女状况",
            selectEducationLevel: "选择教育水平",
            selectRace: "选择种族"
        },
        "zh-hk": {
            focusGroupSystem: "焦點小組系統",
            logout: "登出",
            sessionType: "會議類型:",
            selectSessionType: "選擇會議類型",
            sessionName: "會議名稱:",
            enterSessionName: "輸入會議名稱...",
            numberOfParticipants: "參與者人數:",
            productName: "產品名稱:",
            enterProductName: "輸入產品名稱...",
            productDescription: "產品描述:",
            describeProduct: "描述產品...",
            productCategory: "產品類別:",
            productCategoryExample: "例如：電子產品、時尚、食品...",
            startFocusGroup: "開始焦點小組",
            selectCategories: "選擇類別",
            selectGender: "選擇性別",
            selectAgeRange: "選擇年齡範圍",
            selectIncomeRange: "選擇收入範圍",
            selectMaritalStatus: "選擇婚姻狀況",
            selectChildrenStatus: "選擇子女狀況",
            selectEducationLevel: "選擇教育水平",
            selectRace: "選擇種族"
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 