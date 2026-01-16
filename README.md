# FTracking - Middle East Flight Tracker

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://crazydubya.github.io/FTracking/)
[![Update Frequency](https://img.shields.io/badge/Updates-Every%205%20Minutes-green)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

## ⚠️ CRITICAL SAFETY WARNING

**THIS APPLICATION IS FOR INFORMATIONAL PURPOSES ONLY**

- **DO NOT** use for operational decisions, flight planning, or navigation
- **DO NOT** use for safety-critical operations
- **ALWAYS** consult official aviation authorities for operational information
- **Flight data**: Real data from OpenSky Network (subject to coverage limitations)
- **NOTAM data**: NOT AVAILABLE without authenticated API access to official aviation authorities

This is a demonstration/educational project showing how to integrate with aviation APIs. It must not be used for actual flight operations.

---

Real-time flight tracking system for Middle East airspace regions including Israel, Jordan, Iraq, and Iran.

## 🔑 API Key Requirements

### Quick Answer:
- **Flight Tracking**: ✅ NO API KEY REQUIRED (uses free OpenSky Network API)
- **NOTAM Data**: ❌ API KEYS REQUIRED (from FAA, ICAO, or regional aviation authorities)

### Where to Store API Keys:
1. Open `script.js` 
2. Find the `CONFIG.API_KEYS` section (lines ~6-15)
3. Add your API keys there:
   ```javascript
   API_KEYS: {
       OPENSKY_USERNAME: '',        // Optional - for higher rate limits
       OPENSKY_PASSWORD: '',        // Optional - for higher rate limits
       FAA_NOTAM_API_KEY: '',      // Required for FAA NOTAMs
       ICAO_API_KEY: '',           // Required for ICAO NOTAMs
   }
   ```
4. See [Configuration section](#-configuration) below for detailed instructions

**Important**: Never commit API keys to version control. For production, use environment variables or a backend proxy server.

## 🌍 Coverage

This tracker monitors the following Flight Information Regions (FIRs):

- 🇮🇱 **Israel** (LLLL FIR)
- 🇯🇴 **Jordan** (OJAM FIR)
- 🇮🇶 **Iraq** (ORBI FIR)
- 🇮🇷 **Iran** (OIIX FIR)

## ✨ Features

- **Real-time Flight Tracking**: Live flight data from OpenSky Network (REAL DATA)
- **NOTAM Monitoring**: NOT AVAILABLE - Requires authenticated access to official aviation authority APIs
- **Auto-refresh**: Automatically updates every 5 minutes
- **Interactive Filtering**: Filter by country/airspace
- **Responsive Design**: Works on desktop and mobile devices
- **Free Data Sources**: Uses only free, publicly available APIs for flight tracking

## ⚠️ Data Authenticity

### Flight Data (REAL)
- Source: OpenSky Network crowd-sourced ADS-B data
- Status: **REAL DATA** - Live aircraft positions from actual receivers
- Limitations: Coverage depends on receiver network, some areas may have gaps

### NOTAM Data (NOT AVAILABLE)
- Status: **NOT AVAILABLE** - Requires authenticated API access
- Real NOTAMs require credentials from official aviation authorities (FAA, ICAO, regional authorities)
- **NEVER** rely on this application for NOTAM information
- **ALWAYS** consult official sources for NOTAMs

## 🚀 Live Demo

Visit the live tracker: [https://crazydubya.github.io/FTracking/](https://crazydubya.github.io/FTracking/)

## 📊 Data Sources

### Flight Data (REAL)
- **[OpenSky Network](https://opensky-network.org/)**: Open-source flight tracking network
  - **REAL DATA**: Actual aircraft positions from crowd-sourced ADS-B receivers
  - No API key required
  - Global coverage with limitations based on receiver network

### NOTAM Data (NOT AVAILABLE)
**This application does NOT provide NOTAM data.** Real NOTAM data requires:

- **[FAA NOTAM Search](https://notams.aim.faa.gov/notamSearch/)**: Requires authentication
- **ICAO APIs**: Requires credentials and authorization
- **Regional Aviation Authorities**: Requires proper credentials

**CRITICAL**: Do not expect NOTAM information from this application. Always consult official aviation authorities for current NOTAMs.

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **Vanilla JavaScript**: No framework dependencies
- **GitHub Pages**: Free static site hosting

## 📦 Installation & Setup

### For GitHub Pages Deployment

1. Fork this repository
2. Go to repository Settings
3. Navigate to Pages section
4. Select the branch (main) and root directory
5. Save and wait for deployment
6. Access your tracker at `https://yourusername.github.io/FTracking/`

### For Local Development

1. Clone the repository:
```bash
git clone https://github.com/CrazyDubya/FTracking.git
cd FTracking
```

2. Open `index.html` in a web browser:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Or simply open the file
open index.html
```

3. Navigate to `http://localhost:8000` (or the appropriate URL)

## 🔧 Configuration

### API Keys and Authentication

#### Flight Data (OpenSky Network)
**Status**: ✅ NO API KEY REQUIRED for basic usage

- The OpenSky Network API is free and works without authentication
- **Optional**: Create a free account at [OpenSky Network](https://opensky-network.org/) for higher rate limits
- If you have an account, add credentials to `CONFIG.API_KEYS` in `script.js`:
  ```javascript
  API_KEYS: {
      OPENSKY_USERNAME: 'your-username',
      OPENSKY_PASSWORD: 'your-password',
  }
  ```

#### NOTAM Data
**Status**: ❌ API KEYS REQUIRED (not included)

Real NOTAM data requires authenticated access to official aviation authority APIs.

**Research Confirmation (January 2026):**
We have confirmed through comprehensive research that **there is NO legitimate way to access real-time NOTAM data without authentication**. All reputable sources require API keys or registration:

- **FAA (US)**: Requires registration at api.faa.gov and API key generation
- **ICAO (International)**: Requires credentials and authorization
- **EUROCONTROL (Europe)**: EAD Basic is manual-only; APIs require registration
- **Commercial Providers**: Notamify, Aviation Edge, etc. all require API keys
- **Web Scraping**: Violates Terms of Service and is illegal for most official sites

**How to Configure NOTAM API Keys:**

1. **Obtain API Credentials** from official sources:
   - **FAA NOTAM Search API**: Register at [https://notams.aim.faa.gov/](https://notams.aim.faa.gov/)
   - **ICAO**: Contact ICAO for credentials and authorization
   - **Regional Aviation Authorities**: Contact your regional authority

2. **Store API Keys Securely**:
   - **Development**: Copy `config.example.js` to `config.js` and add your keys
   - **Production**: Use environment variables or a secure backend service
   - **NEVER** commit API keys to version control (already in `.gitignore`)

3. **Add Keys to Configuration**:
   Open `script.js` and add your API keys to the `CONFIG.API_KEYS` section:
   ```javascript
   API_KEYS: {
       FAA_NOTAM_API_KEY: 'your-faa-api-key-here',
       ICAO_API_KEY: 'your-icao-api-key-here',
   }
   ```

4. **Implement API Integration**:
   - The `fetchNOTAMData()` function checks for API keys
   - You'll need to implement the actual API calls based on your provider's documentation
   - See the TODO comment in `script.js` for where to add integration code

**Security Best Practices:**
- For production, use a backend server to proxy API calls and keep keys secure
- Never expose API keys in client-side code that's publicly accessible
- Use environment variables or secure configuration management
- Rotate API keys regularly

### Adjusting Update Frequency

Edit `script.js` to change the auto-refresh interval:

```javascript
const CONFIG = {
    UPDATE_INTERVAL: 5 * 60 * 1000, // Change this value (in milliseconds)
    // 5 minutes = 5 * 60 * 1000
    // 10 minutes = 10 * 60 * 1000
};
```

### Adding Additional Airspace Regions

To monitor additional regions, edit the `AIRSPACE_BOUNDARIES` in `script.js`:

```javascript
AIRSPACE_BOUNDARIES: {
    // ... existing regions ...
    newregion: {
        name: 'New Region',
        icao: 'XXXX', // ICAO code
        bounds: { 
            minLat: 00.0, 
            maxLat: 00.0, 
            minLon: 00.0, 
            maxLon: 00.0 
        }
    }
}
```

## 📱 Usage

1. **View Active Flights**: See real-time flights from OpenSky Network in each airspace region
2. **Monitor NOTAMs**: NOT AVAILABLE - Requires authenticated API access to official sources
3. **Filter by Region**: Use checkboxes to show/hide specific countries
4. **Manual Refresh**: Click "Refresh Now" to update immediately
5. **Auto-updates**: Flight data automatically refreshes every 5 minutes

## ⚠️ Limitations & Safety

### Critical Safety Information
- **FOR INFORMATIONAL/EDUCATIONAL USE ONLY**
- **NOT FOR OPERATIONAL USE**
- **NOT FOR FLIGHT PLANNING**
- **NOT FOR NAVIGATION**
- **NOT FOR SAFETY-CRITICAL DECISIONS**

### Data Limitations
- Uses free, publicly available flight tracking data (OpenSky Network)
- **NO NOTAM DATA AVAILABLE** - Requires authenticated API access
- Some military or restricted flight information may not be available
- Flight data coverage depends on ADS-B receiver network
- OpenSky Network has rate limits for unauthenticated requests
- **CORS Policy**: Direct browser access may be blocked; best deployed via GitHub Pages or with proxy
- **ALWAYS consult official aviation authorities** for operational information

## 🤝 Contributing

Contributions are welcome! Here are ways you can help:

1. **Add More Data Sources**: Integrate additional free aviation APIs
2. **Improve UI/UX**: Enhance the design and user experience
3. **Add Features**: Implement flight history, alerts, or notifications
4. **Fix Bugs**: Report and fix issues
5. **Documentation**: Improve setup and usage instructions

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [OpenSky Network](https://opensky-network.org/) for providing free flight tracking data
- ICAO for aviation standards and data formats
- All contributors who help improve this project

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/CrazyDubya/FTracking/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CrazyDubya/FTracking/discussions)

## 🔐 Security & Privacy

- No user data is collected
- All data fetching happens client-side
- No cookies or tracking mechanisms
- Uses only public aviation data from OpenSky Network
- **NO FAKE DATA**: Application only displays real flight data or clearly indicates when data is unavailable

## ⚠️ Disclaimer & Legal

**CRITICAL SAFETY NOTICE**: This application is provided "as is" for informational and educational purposes only. 

- **DO NOT USE FOR OPERATIONAL DECISIONS**: This tool must not be used for flight operations, flight planning, navigation, or any safety-critical decisions
- **REAL DATA ONLY**: Flight data is real (from OpenSky Network), NOTAM data is NOT AVAILABLE
- **NO WARRANTY**: No warranty of accuracy, completeness, or fitness for any purpose
- **NO LIABILITY**: Developers assume no liability for any decisions made based on information from this application
- **OFFICIAL SOURCES REQUIRED**: Always consult official aviation authorities and approved sources for operational information

By using this application, you acknowledge that you will not rely on it for any operational, safety-critical, or flight-related decisions.

## 🔧 Troubleshooting

### "API Access Note" or "N/A" for flight data

If you see "N/A" instead of flight counts or an API access note, this is likely due to:

1. **CORS Policy**: Browser security prevents direct API access
   - **Solution**: Deploy to GitHub Pages where CORS is better handled
   - **Alternative**: Set up a backend proxy server

2. **Ad Blocker**: Some ad blockers block tracking domains
   - **Solution**: Whitelist `opensky-network.org` in your ad blocker

3. **Rate Limiting**: OpenSky Network limits unauthenticated requests
   - **Solution**: Wait a few minutes and try again
   - **Alternative**: Create a free OpenSky Network account for higher limits

### Data not refreshing

- Check your internet connection
- Verify the page isn't paused (check browser tab)
- Try clicking "Refresh Now" button
- Check browser console for errors (F12 → Console tab)

## 🗺️ Roadmap

- [ ] Integrate with authenticated NOTAM APIs when credentials are available
- [ ] Historical flight data visualization
- [ ] Weather overlay integration
- [ ] Airport status information from official sources
- [ ] Improved data accuracy and coverage

**Note**: Any future NOTAM integration will require proper authentication and credentials from official aviation authorities. Fake or sample data will never be used.

---

**Disclaimer**: This tool is for informational and educational purposes only. Do not use for navigation, flight planning, or operational decisions. Always consult official aviation authorities for accurate and up-to-date information.