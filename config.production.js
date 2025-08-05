// Production Configuration for Focus Group System
// This file contains settings optimized for live server deployment

const CONFIG = {
    // Webhook URL for creating focus groups (no longer creating participants)
    WEBHOOK_URL: "https://creativventures.app.n8n.cloud/webhook/focus-group-ai",
    
    // CORS Proxy URL (disabled in production)
    CORS_PROXY_URL: "https://cors-anywhere.herokuapp.com/",
    
    // Use CORS proxy for development (disabled in production)
    USE_CORS_PROXY: false,
    
    // Production settings
    IS_PRODUCTION: true, // Set to true when deployed to live server
    
    // Session types for the Run Focus Group form (Market Research is default)
    SESSION_TYPES: [
        { value: "market_research", label: "Market Research" },
        { value: "product_testing", label: "Product Testing" },
        { value: "user_experience", label: "User Experience" },
        { value: "customer_feedback", label: "Customer Feedback" },
        { value: "brand_perception", label: "Brand Perception" },
        { value: "competitive_analysis", label: "Competitive Analysis" },
        { value: "advertising_testing", label: "Advertising Testing" },
        { value: "pricing_research", label: "Pricing Research" },
        { value: "concept_validation", label: "Concept Validation" },
        { value: "satisfaction_survey", label: "Satisfaction Survey" }
    ],
    
    // Participant categories for the Run Focus Group form
    PARTICIPANT_CATEGORIES: [
        { value: "general_consumers", label: "General Consumers" },
        { value: "online_shoppers", label: "Online Shoppers" },
        { value: "budget_conscious_shoppers", label: "Budget-Conscious Shoppers" },
        { value: "luxury_buyers", label: "Luxury Buyers" },
        { value: "electronics_buyers", label: "Electronics Buyers" },
        { value: "fashion_enthusiasts", label: "Fashion Enthusiasts" },
        { value: "health_conscious", label: "Health-Conscious" },
        { value: "tech_savvy", label: "Tech-Savvy" },
        { value: "small_business_owners", label: "Small Business Owners" },
        { value: "students", label: "Students" },
        { value: "professionals", label: "Professionals" },
        { value: "parents", label: "Parents" },
        { value: "seniors", label: "Seniors" },
        { value: "millennials", label: "Millennials" },
        { value: "gen_z", label: "Gen Z" }
    ],
    
    // Default form values
    DEFAULT_VALUES: {
        session_name: "",
        session_type: "market_research",
        categories: ["general_consumers"],
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
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 