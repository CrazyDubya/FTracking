// API Configuration Template
// Copy this file to 'config.js' and add your API keys
// NEVER commit config.js with actual API keys to version control

const API_CONFIG = {
    // OpenSky Network (Optional)
    // Free tier: No credentials needed (subject to rate limits)
    // With account: Higher rate limits
    // Sign up at: https://opensky-network.org/
    OPENSKY: {
        USERNAME: '', // Optional - leave empty for anonymous access
        PASSWORD: ''  // Optional - leave empty for anonymous access
    },
    
    // NOTAM APIs (Required for NOTAM data)
    // These require registration with official aviation authorities
    NOTAM: {
        // FAA NOTAM Search API
        // Register at: https://notams.aim.faa.gov/
        FAA_API_KEY: '',
        
        // ICAO NOTAM Service
        // Contact ICAO for credentials and authorization
        ICAO_API_KEY: '',
        
        // Add additional NOTAM API credentials as needed
        // Example: Regional aviation authority APIs
    }
};

// Export configuration (if using modules)
// export default API_CONFIG;
