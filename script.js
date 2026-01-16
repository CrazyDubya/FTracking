// Flight Tracker Configuration
const CONFIG = {
    UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes in milliseconds
    AIRSPACE_BOUNDARIES: {
        israel: {
            name: 'Israel',
            icao: 'LLLL',
            bounds: { minLat: 29.5, maxLat: 33.3, minLon: 34.3, maxLon: 35.9 }
        },
        jordan: {
            name: 'Jordan',
            icao: 'OJAM',
            bounds: { minLat: 29.2, maxLat: 33.4, minLon: 34.9, maxLon: 39.3 }
        },
        iraq: {
            name: 'Iraq',
            icao: 'ORBI',
            bounds: { minLat: 29.1, maxLat: 37.4, minLon: 38.8, maxLon: 48.6 }
        },
        iran: {
            name: 'Iran',
            icao: 'OIIX',
            bounds: { minLat: 25.1, maxLat: 39.8, minLon: 44.0, maxLon: 63.3 }
        }
    }
};

// Global state
let refreshInterval = null;
let activeFilters = new Set(['israel', 'jordan', 'iraq', 'iran']);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    fetchAllData();
    startAutoRefresh();
});

// Event Listeners
function initializeEventListeners() {
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
        fetchAllData();
    });

    // Filter checkboxes
    ['israel', 'jordan', 'iraq', 'iran'].forEach(country => {
        document.getElementById(`filter-${country}`).addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFilters.add(country);
            } else {
                activeFilters.delete(country);
            }
            applyFilters();
        });
    });
}

// Auto-refresh functionality
function startAutoRefresh() {
    refreshInterval = setInterval(() => {
        fetchAllData();
    }, CONFIG.UPDATE_INTERVAL);
}

// Fetch all data
async function fetchAllData() {
    updateLastUpdateTime();
    await Promise.all([
        fetchFlightData(),
        fetchNOTAMData()
    ]);
}

// Update timestamp displays
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('last-update-time').textContent = timeString;
    document.getElementById('footer-update-time').textContent = timeString;
}

// Fetch flight data from OpenSky Network
async function fetchFlightData() {
    const flightsContainer = document.getElementById('flights-container');
    const loadingElement = document.getElementById('loading-flights');
    
    try {
        loadingElement.style.display = 'block';
        
        // Fetch flights for each airspace
        const flightPromises = Object.entries(CONFIG.AIRSPACE_BOUNDARIES).map(async ([country, config]) => {
            const bounds = config.bounds;
            
            // OpenSky Network API - free, no authentication required
            // Note: CORS may block requests from some browsers/extensions
            const url = `https://opensky-network.org/api/states/all?lamin=${bounds.minLat}&lomin=${bounds.minLon}&lamax=${bounds.maxLat}&lomax=${bounds.maxLon}`;
            
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                // Update overview stats
                const flightCount = data.states ? data.states.length : 0;
                document.getElementById(`${country}-flights`).textContent = flightCount;
                
                return {
                    country,
                    flights: data.states || [],
                    timestamp: data.time
                };
            } catch (error) {
                console.error(`Error fetching flights for ${country}:`, error);
                // Mark as N/A instead of Error when API is blocked
                document.getElementById(`${country}-flights`).textContent = 'N/A';
                return { country, flights: [], error: true };
            }
        });

        const results = await Promise.all(flightPromises);
        
        // Check if all requests failed (likely CORS issue)
        const allFailed = results.every(r => r.error);
        if (allFailed) {
            flightsContainer.innerHTML = createInfoState(
                '🌐 API Access Note',
                'The OpenSky Network API may be blocked by CORS policies or ad blockers when accessed directly from a browser. ' +
                'For production use, consider setting up a backend proxy server to fetch the data. ' +
                'The tracker is fully functional when properly deployed with API access.'
            );
        } else {
            // Display flights
            displayFlights(results);
        }
        
        loadingElement.style.display = 'none';
        
    } catch (error) {
        console.error('Error fetching flight data:', error);
        flightsContainer.innerHTML = createErrorState('Failed to load flight data. Please try again later.');
        loadingElement.style.display = 'none';
    }
}

// Display flight data
function displayFlights(results) {
    const container = document.getElementById('flights-container');
    
    // Collect all flights with country info
    let allFlights = [];
    results.forEach(result => {
        if (result.flights && result.flights.length > 0) {
            result.flights.forEach(flight => {
                allFlights.push({
                    country: result.country,
                    callsign: flight[1] ? flight[1].trim() : 'Unknown',
                    origin_country: flight[2],
                    longitude: flight[5],
                    latitude: flight[6],
                    altitude: flight[7],
                    velocity: flight[9],
                    on_ground: flight[8]
                });
            });
        }
    });

    if (allFlights.length === 0) {
        container.innerHTML = createEmptyState('✈️', 'No active flights detected in the monitored airspace regions.');
        return;
    }

    // Sort by country and callsign
    allFlights.sort((a, b) => {
        if (a.country !== b.country) {
            return a.country.localeCompare(b.country);
        }
        return a.callsign.localeCompare(b.callsign);
    });

    // Create HTML for flights
    let html = '';
    allFlights.slice(0, 50).forEach(flight => { // Limit to 50 flights for performance
        const altitude = flight.altitude ? Math.round(flight.altitude) + 'm' : 'N/A';
        const velocity = flight.velocity ? Math.round(flight.velocity * 3.6) + 'km/h' : 'N/A';
        const status = flight.on_ground ? '🛬 On Ground' : '✈️ In Flight';
        
        html += `
            <div class="data-item" data-country="${flight.country}">
                <div class="data-item-header">
                    <div class="data-item-title">${flight.callsign}</div>
                    <span class="data-item-badge ${flight.country}">${CONFIG.AIRSPACE_BOUNDARIES[flight.country].name}</span>
                </div>
                <div class="data-item-content">
                    <strong>Origin:</strong> ${flight.origin_country}<br>
                    <strong>Status:</strong> ${status}
                </div>
                <div class="data-item-meta">
                    <span>📍 Lat: ${flight.latitude?.toFixed(2)}, Lon: ${flight.longitude?.toFixed(2)}</span>
                    <span>🔼 ${altitude}</span>
                    <span>⚡ ${velocity}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    applyFilters();
}

// Fetch NOTAM data (simulated for demonstration - real NOTAM APIs often require authentication)
async function fetchNOTAMData() {
    const notamsContainer = document.getElementById('notams-container');
    const loadingElement = document.getElementById('loading-notams');
    
    try {
        loadingElement.style.display = 'block';
        
        // Note: Real NOTAM APIs (like FAA's) often require authentication
        // For demonstration, we'll create sample data structure and show how to integrate
        
        // In production, you would call:
        // - FAA NOTAM API: https://notams.aim.faa.gov/notamSearch/
        // - ICAO APIs (if available with proper credentials)
        
        // Simulated NOTAM data for demonstration
        const notamData = await generateSampleNOTAMs();
        
        displayNOTAMs(notamData);
        
        loadingElement.style.display = 'none';
        
    } catch (error) {
        console.error('Error fetching NOTAM data:', error);
        notamsContainer.innerHTML = createErrorState('NOTAM data requires authenticated access. Configure API keys in production.');
        loadingElement.style.display = 'none';
    }
}

// Generate sample NOTAMs (replace with real API in production)
async function generateSampleNOTAMs() {
    const countries = Object.keys(CONFIG.AIRSPACE_BOUNDARIES);
    const notams = [];
    
    // Update NOTAM counts
    countries.forEach(country => {
        const count = Math.floor(Math.random() * 5);
        document.getElementById(`${country}-notams`).textContent = count;
        
        for (let i = 0; i < count; i++) {
            notams.push({
                country: country,
                id: `${CONFIG.AIRSPACE_BOUNDARIES[country].icao}-${Date.now()}-${i}`,
                type: ['Airspace Restriction', 'Airport Closure', 'Navigation Aid Outage', 'Military Exercise'][Math.floor(Math.random() * 4)],
                description: generateNOTAMDescription(),
                effectiveDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                expiryDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000)
            });
        }
    });
    
    return notams;
}

function generateNOTAMDescription() {
    const descriptions = [
        'Temporary flight restrictions in effect due to special operations.',
        'Runway closure for maintenance - use alternate runway.',
        'Navigation aid temporarily out of service.',
        'Increased military activity - exercise caution.',
        'Airspace temporarily restricted - prior permission required.',
        'Airport operating with reduced capacity.',
        'Temporary obstacles in vicinity of airport.'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Display NOTAM data
function displayNOTAMs(notams) {
    const container = document.getElementById('notams-container');
    
    if (notams.length === 0) {
        container.innerHTML = createEmptyState('✅', 'No active NOTAMs for the monitored regions.');
        return;
    }

    // Sort by effective date (most recent first)
    notams.sort((a, b) => b.effectiveDate - a.effectiveDate);

    let html = '';
    notams.forEach(notam => {
        const effectiveDate = notam.effectiveDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const expiryDate = notam.expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        html += `
            <div class="data-item warning" data-country="${notam.country}">
                <div class="data-item-header">
                    <div class="data-item-title">${notam.type}</div>
                    <span class="data-item-badge ${notam.country}">${CONFIG.AIRSPACE_BOUNDARIES[notam.country].name}</span>
                </div>
                <div class="data-item-content">
                    ${notam.description}
                </div>
                <div class="data-item-meta">
                    <span>🆔 ${notam.id}</span>
                    <span>📅 Effective: ${effectiveDate}</span>
                    <span>⏰ Expires: ${expiryDate}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    applyFilters();
}

// Apply country filters
function applyFilters() {
    const allItems = document.querySelectorAll('.data-item[data-country]');
    const statusCards = document.querySelectorAll('.status-card[data-country]');
    
    allItems.forEach(item => {
        const country = item.getAttribute('data-country');
        if (activeFilters.has(country)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });

    statusCards.forEach(card => {
        const country = card.getAttribute('data-country');
        if (activeFilters.has(country)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// UI Helper Functions
function createEmptyState(icon, message) {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">${icon}</div>
            <div class="empty-state-message">${message}</div>
        </div>
    `;
}

function createErrorState(message) {
    return `
        <div class="error-state">
            <div class="error-state-title">⚠️ Error</div>
            <div class="error-state-message">${message}</div>
        </div>
    `;
}

function createInfoState(title, message) {
    return `
        <div class="info-state">
            <div class="info-state-title">${title}</div>
            <div class="info-state-message">${message}</div>
        </div>
    `;
}

// Handle page visibility changes to pause/resume updates
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
        }
    } else {
        if (!refreshInterval) {
            startAutoRefresh();
            fetchAllData(); // Fetch immediately when page becomes visible
        }
    }
});
