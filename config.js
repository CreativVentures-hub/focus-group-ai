// Production Configuration for Focus Group System
// This file contains settings optimized for live server deployment

const CONFIG = {
    // Webhook URL for Focus Group AI 2.0
    WEBHOOK_URL: "https://creativventures.app.n8n.cloud/webhook/enhanced-focus-group",
    

    
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
        { value: "bedding_linens", label: "Bedding and Linens" },
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
        { value: "gifts_special_occasions", label: "Gifts and Special Occasions" },
        { value: "tools_hardware", label: "Tools and Hardware" },
        { value: "camping_outdoors", label: "Camping and Outdoors" }
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
            productPrice: "Product Price:",
            enterProductPrice: "Enter product price (e.g., $29.99, €25.00, £19.99)...",
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
        selectRace: "Select Race",
        // Form labels
        marketName: "Market Name:",
        marketDescription: "Market Description:",
        brandName: "Brand Name:",
        brandDescription: "Brand Description:",
        productImage: "Product Image:",
        brandImage: "Brand Image:",
        emailAddress: "Email Address:",
        questions: "AI-Generated Questions",
        selectedCriteria: "Selected Criteria:",
        // Placeholders
        enterMarketName: "Enter market name...",
        describeMarket: "Describe the market in detail...",
        enterBrandName: "Enter brand name...",
        describeBrand: "Describe the brand in detail...",
        enterEmail: "Enter your email address...",
        // Modal titles
        buyingBehaviors: "Buying Behaviors",
        productCategories: "Product Categories",
        // Success modal
        successTitle: "Focus Group Request Submitted!",
        successMessage: "Your focus group request has been successfully submitted.",
        emailNotice: "You will receive an email with your focus group results when they are ready.",
        processingInfo: "Processing typically takes 5-10 minutes.",
        gotIt: "Got it!",
        enterQuestion: "Enter question...",
        // Demographic options
        any: "Any",
        male: "Male",
        female: "Female",
        // Modal content
        selectParticipantCategories: "Select Participant Categories",
        searchCategories: "Search categories...",
        clearAll: "Clear All",
        applySelection: "Apply Selection",
        // Category names
        general: "General",
        online: "Online",
        budgetConscious: "Budget-Conscious",
        luxury: "Luxury",
        ecoConscious: "Eco-Conscious",
        impulseBuyer: "Impulse Buyer",
        researchHeavy: "Research Heavy",
        brandLoyal: "Brand Loyal",
        dealSeekers: "Deal Seekers",
        // Session type options
        marketResearch: "Market Research",
        productResearch: "Product Research",
        userExperience: "User Experience",
        customerFeedback: "Customer Feedback",
        brandPerception: "Brand Perception",
        competitiveAnalysis: "Competitive Analysis",
        advertisingTesting: "Advertising Testing",
        pricingResearch: "Pricing Research",
        conceptValidation: "Concept Validation",
        satisfactionSurvey: "Satisfaction Survey",
        comingSoon: "Coming Soon"
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
            productPrice: "产品价格:",
            enterProductPrice: "输入产品价格（例如：$29.99、€25.00、£19.99）...",
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
        selectRace: "选择种族",
        // Form labels
        marketName: "市场名称:",
        marketDescription: "市场描述:",
        brandName: "品牌名称:",
        brandDescription: "品牌描述:",
        productImage: "产品图片:",
        brandImage: "品牌图片:",
        emailAddress: "邮箱地址:",
        questions: "AI生成的问题",
        selectedCriteria: "已选标准:",
        // Placeholders
        enterMarketName: "输入市场名称...",
        describeMarket: "详细描述市场...",
        enterBrandName: "输入品牌名称...",
        describeBrand: "详细描述品牌...",
        enterEmail: "输入您的邮箱地址...",
        // Modal titles
        buyingBehaviors: "购买行为",
        productCategories: "产品类别",
        // Success modal
        successTitle: "焦点小组请求已提交!",
        successMessage: "您的焦点小组请求已成功提交。",
        emailNotice: "当结果准备好时，您将收到一封包含焦点小组结果的电子邮件。",
        processingInfo: "处理通常需要5-10分钟。",
        gotIt: "知道了!",
        enterQuestion: "输入问题...",
        // Demographic options
        any: "任何",
        male: "男性",
        female: "女性",
        // Modal content
        selectParticipantCategories: "选择参与者类别",
        searchCategories: "搜索类别...",
        clearAll: "清除全部",
        applySelection: "应用选择",
        // Category names
        general: "通用",
        online: "在线",
        budgetConscious: "预算意识",
        luxury: "奢侈品",
        ecoConscious: "环保意识",
        impulseBuyer: "冲动购买",
        researchHeavy: "重度研究",
        brandLoyal: "品牌忠诚",
        dealSeekers: "优惠寻求者",
        // Session type options
        marketResearch: "市场研究",
        productResearch: "产品研究",
        userExperience: "用户体验",
        customerFeedback: "客户反馈",
        brandPerception: "品牌认知",
        competitiveAnalysis: "竞争分析",
        advertisingTesting: "广告测试",
        pricingResearch: "定价研究",
        conceptValidation: "概念验证",
        satisfactionSurvey: "满意度调查",
        comingSoon: "即将推出"
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
            productPrice: "產品價格:",
            enterProductPrice: "輸入產品價格（例如：$29.99、€25.00、£19.99）...",
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
        selectRace: "選擇種族",
        // Form labels
        marketName: "市場名稱:",
        marketDescription: "市場描述:",
        brandName: "品牌名稱:",
        brandDescription: "品牌描述:",
        productImage: "產品圖片:",
        brandImage: "品牌圖片:",
        emailAddress: "郵箱地址:",
        questions: "AI生成的問題",
        selectedCriteria: "已選標準:",
        // Placeholders
        enterMarketName: "輸入市場名稱...",
        describeMarket: "詳細描述市場...",
        enterBrandName: "輸入品牌名稱...",
        describeBrand: "詳細描述品牌...",
        enterEmail: "輸入您的郵箱地址...",
        // Modal titles
        buyingBehaviors: "購買行為",
        productCategories: "產品類別",
        // Success modal
        successTitle: "焦點小組請求已提交!",
        successMessage: "您的焦點小組請求已成功提交。",
        emailNotice: "當結果準備好時，您將收到一封包含焦點小組結果的電子郵件。",
        processingInfo: "處理通常需要5-10分鐘。",
        gotIt: "知道了!",
        enterQuestion: "輸入問題...",
        // Demographic options
        any: "任何",
        male: "男性",
        female: "女性",
        // Modal content
        selectParticipantCategories: "選擇參與者類別",
        searchCategories: "搜索類別...",
        clearAll: "清除全部",
        applySelection: "應用選擇",
        // Category names
        general: "通用",
        online: "在線",
        budgetConscious: "預算意識",
        luxury: "奢侈品",
        ecoConscious: "環保意識",
        impulseBuyer: "衝動購買",
        researchHeavy: "重度研究",
        brandLoyal: "品牌忠誠",
        dealSeekers: "優惠尋求者",
        // Session type options
        marketResearch: "市場研究",
        productResearch: "產品研究",
        userExperience: "用戶體驗",
        customerFeedback: "客戶反饋",
        brandPerception: "品牌認知",
        competitiveAnalysis: "競爭分析",
        advertisingTesting: "廣告測試",
        pricingResearch: "定價研究",
        conceptValidation: "概念驗證",
        satisfactionSurvey: "滿意度調查",
        comingSoon: "即將推出"
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 