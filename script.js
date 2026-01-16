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
    },
    // Airport codes database for Middle East region
    AIRPORTS: {
        // Israel
        'LLBG': { icao: 'LLBG', iata: 'TLV', name: 'Ben Gurion International Airport', city: 'Tel Aviv' },
        'LLOV': { icao: 'LLOV', iata: 'VDA', name: 'Ovda Airport', city: 'Ovda' },
        'LLER': { icao: 'LLER', iata: 'ETH', name: 'Eilat Airport', city: 'Eilat' },
        'LLHA': { icao: 'LLHA', iata: 'HFA', name: 'Haifa Airport', city: 'Haifa' },
        'LLSD': { icao: 'LLSD', iata: 'SDV', name: 'Sde Dov Airport', city: 'Tel Aviv' },
        // Jordan
        'OJAI': { icao: 'OJAI', iata: 'AMM', name: 'Queen Alia International Airport', city: 'Amman' },
        'OJAM': { icao: 'OJAM', iata: 'ADJ', name: 'Marka International Airport', city: 'Amman' },
        'OJAQ': { icao: 'OJAQ', iata: 'AQJ', name: 'King Hussein International Airport', city: 'Aqaba' },
        // Iraq
        'ORBI': { icao: 'ORBI', iata: 'BGW', name: 'Baghdad International Airport', city: 'Baghdad' },
        'ORBB': { icao: 'ORBB', iata: 'BSR', name: 'Basra International Airport', city: 'Basra' },
        'ORMM': { icao: 'ORMM', iata: 'EBL', name: 'Erbil International Airport', city: 'Erbil' },
        'ORBM': { icao: 'ORBM', iata: 'OSM', name: 'Mosul International Airport', city: 'Mosul' },
        'ORSU': { icao: 'ORSU', iata: 'ISU', name: 'Sulaymaniyah International Airport', city: 'Sulaymaniyah' },
        // Iran
        'OIII': { icao: 'OIII', iata: 'IKA', name: 'Imam Khomeini International Airport', city: 'Tehran' },
        'OIIE': { icao: 'OIIE', iata: 'THR', name: 'Mehrabad International Airport', city: 'Tehran' },
        'OISS': { icao: 'OISS', iata: 'SYZ', name: 'Shiraz International Airport', city: 'Shiraz' },
        'OIAW': { icao: 'OIAW', iata: 'AWZ', name: 'Ahvaz International Airport', city: 'Ahvaz' },
        'OIMM': { icao: 'OIMM', iata: 'KSH', name: 'Shahid Ashrafi Esfahani Airport', city: 'Kermanshah' },
        'OIKB': { icao: 'OIKB', iata: 'BND', name: 'Bandar Abbas International Airport', city: 'Bandar Abbas' },
        'OICC': { icao: 'OICC', iata: 'KER', name: 'Kerman Airport', city: 'Kerman' },
        'OIFM': { icao: 'OIFM', iata: 'IFN', name: 'Isfahan International Airport', city: 'Isfahan' },
        'OITT': { icao: 'OITT', iata: 'TBZ', name: 'Tabriz International Airport', city: 'Tabriz' },
        'OIMJ': { icao: 'OIMJ', iata: 'MHD', name: 'Mashhad International Airport', city: 'Mashhad' }
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

    // Filter checkboxes - dynamically based on configured airspaces
    Object.keys(CONFIG.AIRSPACE_BOUNDARIES).forEach(country => {
        const filterElement = document.getElementById(`filter-${country}`);
        if (filterElement) {
            filterElement.addEventListener('change', (e) => {
                if (e.target.checked) {
                    activeFilters.add(country);
                } else {
                    activeFilters.delete(country);
                }
                applyFilters();
            });
        }
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

    // Filter for potential disruptions: grounded flights or very low/slow flights
    // This filters OUT actively flying aircraft to show only potential disruptions
    // Criteria: on_ground = true OR altitude < 1000m OR velocity < 50 km/h
    const disruptedFlights = allFlights.filter(flight => {
        const velocityKmh = flight.velocity ? flight.velocity * 3.6 : 0;
        const altitudeMeters = flight.altitude || 0;
        
        // Show flights that are:
        // 1. On the ground (on_ground = true)
        // 2. At very low altitude (< 1000m) suggesting airport vicinity
        // 3. Moving very slowly (< 50 km/h) suggesting ground operations or issues
        return flight.on_ground === true || 
               altitudeMeters < 1000 || 
               velocityKmh < 50;
    });

    if (disruptedFlights.length === 0) {
        container.innerHTML = createEmptyState('✅', 'No flight disruptions detected. All flights appear to be operating normally.');
        return;
    }

    // Sort by country and callsign
    disruptedFlights.sort((a, b) => {
        if (a.country !== b.country) {
            return a.country.localeCompare(b.country);
        }
        return a.callsign.localeCompare(b.callsign);
    });

    // Create HTML for flights
    let html = '';
    disruptedFlights.slice(0, 50).forEach(flight => { // Limit to 50 flights for performance
        const altitude = flight.altitude ? Math.round(flight.altitude) + 'm' : 'N/A';
        const velocity = flight.velocity ? Math.round(flight.velocity * 3.6) + 'km/h' : 'N/A';
        const status = flight.on_ground ? '🛬 On Ground' : '⚠️ Low Altitude/Speed';
        
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

// Fetch NOTAM data - requires authenticated API access
async function fetchNOTAMData() {
    const notamsContainer = document.getElementById('notams-container');
    const loadingElement = document.getElementById('loading-notams');
    
    try {
        loadingElement.style.display = 'block';
        
        // NOTAM data requires authenticated access to official aviation APIs
        // Real NOTAM APIs require proper credentials and authorization
        // - FAA NOTAM API: https://notams.aim.faa.gov/notamSearch/ (requires authentication)
        // - ICAO APIs (requires credentials and authorization)
        // - Regional aviation authority APIs (requires credentials)
        
        // Set all NOTAM counts to 0 since we don't have real data
        Object.keys(CONFIG.AIRSPACE_BOUNDARIES).forEach(country => {
            document.getElementById(`${country}-notams`).textContent = 'N/A';
        });
        
        // Display message that real NOTAM data is not available
        notamsContainer.innerHTML = createErrorState(
            '⚠️ NOTAM data unavailable. This application requires authenticated access to official aviation authority APIs to display real NOTAM data. ' +
            'Do not use this application for operational decisions. Always consult official sources like your national aviation authority for current NOTAMs.'
        );
        
        loadingElement.style.display = 'none';
        
    } catch (error) {
        console.error('Error fetching NOTAM data:', error);
        notamsContainer.innerHTML = createErrorState('NOTAM data requires authenticated access. Configure API keys and credentials for official aviation APIs.');
        loadingElement.style.display = 'none';
    }
}

// Helper function to extract airport codes from NOTAM text
// This will be useful when integrating with real NOTAM APIs
function extractAirportCodes(notamText) {
    const codes = [];
    
    // Match 4-letter ICAO codes (e.g., LLBG, OJAI, ORBI)
    const icaoPattern = /\b([A-Z]{4})\b/g;
    let match;
    while ((match = icaoPattern.exec(notamText)) !== null) {
        const code = match[1];
        // Check if this code exists in our airport database
        if (CONFIG.AIRPORTS[code]) {
            codes.push({
                code: code,
                airport: CONFIG.AIRPORTS[code]
            });
        }
    }
    
    // Match 3-letter IATA codes (e.g., TLV, AMM, BGW)
    const iataPattern = /\b([A-Z]{3})\b/g;
    while ((match = iataPattern.exec(notamText)) !== null) {
        const code = match[1];
        // Find airport by IATA code
        const airport = Object.values(CONFIG.AIRPORTS).find(a => a.iata === code);
        if (airport && !codes.find(c => c.code === airport.icao)) {
            codes.push({
                code: airport.icao,
                airport: airport
            });
        }
    }
    
    return codes;
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
        
        // Format airport information prominently
        let airportInfo = '';
        if (notam.airport) {
            const iataCode = notam.airport.iata ? `/${notam.airport.iata}` : '';
            airportInfo = `
                <div class="airport-info">
                    <span class="airport-code">${notam.airportCode}${iataCode}</span>
                    <span class="airport-name">${notam.airport.name}</span>
                    <span class="airport-city">${notam.airport.city}</span>
                </div>
            `;
        }
        
        html += `
            <div class="data-item warning" data-country="${notam.country}">
                <div class="data-item-header">
                    <div class="data-item-title">${notam.type}</div>
                    <span class="data-item-badge ${notam.country}">${CONFIG.AIRSPACE_BOUNDARIES[notam.country].name}</span>
                </div>
                ${airportInfo}
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
