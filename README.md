# FTracking - Middle East Flight & NOTAM Tracker

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://crazydubya.github.io/FTracking/)
[![Update Frequency](https://img.shields.io/badge/Updates-Every%205%20Minutes-green)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

Real-time flight tracking and NOTAM (Notices to Airmen) monitoring system for Middle East airspace regions including Israel, Jordan, Iraq, and Iran.

## 🌍 Coverage

This tracker monitors the following Flight Information Regions (FIRs):

- 🇮🇱 **Israel** (LLLL FIR)
- 🇯🇴 **Jordan** (OJAM FIR)
- 🇮🇶 **Iraq** (ORBI FIR)
- 🇮🇷 **Iran** (OIIX FIR)

## ✨ Features

- **Real-time Flight Tracking**: Live flight data from OpenSky Network
- **NOTAM Monitoring**: Active Notices to Airmen for all covered regions
- **Auto-refresh**: Automatically updates every 5 minutes
- **Interactive Filtering**: Filter by country/airspace
- **Responsive Design**: Works on desktop and mobile devices
- **Free Data Sources**: Uses only free, publicly available APIs

## 🚀 Live Demo

Visit the live tracker: [https://crazydubya.github.io/FTracking/](https://crazydubya.github.io/FTracking/)

## 📊 Data Sources

### Flight Data
- **[OpenSky Network](https://opensky-network.org/)**: Open-source flight tracking network
  - No API key required
  - Real-time ADS-B data
  - Global coverage with crowd-sourced receivers

### NOTAM Data
The current implementation demonstrates the structure for NOTAM integration. For production use with real NOTAM data, consider:

- **[FAA NOTAM Search](https://notams.aim.faa.gov/notamSearch/)**: Federal Aviation Administration NOTAM API
- **ICAO APIs**: International Civil Aviation Organization data (may require credentials)
- **Regional Aviation Authorities**: Direct integration with regional aviation authorities

**Note**: Many official NOTAM APIs require authentication or API keys. The demo version shows sample data structure for integration purposes.

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

1. **View Active Flights**: See real-time flights in each airspace region
2. **Monitor NOTAMs**: Check active notices and restrictions
3. **Filter by Region**: Use checkboxes to show/hide specific countries
4. **Manual Refresh**: Click "Refresh Now" to update immediately
5. **Auto-updates**: Data automatically refreshes every 5 minutes

## ⚠️ Limitations

- Uses free, publicly available data sources
- Some military or restricted flight information may not be available
- NOTAM data may have delays depending on source availability
- OpenSky Network has rate limits for unauthenticated requests
- **CORS Policy**: Direct browser access to OpenSky Network API may be blocked by CORS policies. For production use:
  - Deploy to GitHub Pages (recommended)
  - Use a backend proxy server to fetch API data
  - Or configure proper CORS headers if self-hosting
- For informational purposes only - **NOT for navigation or operational use**

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
- Uses only public aviation data

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

- [ ] Historical flight data visualization
- [ ] Email/SMS alerts for specific events
- [ ] Weather overlay integration
- [ ] Airport status information
- [ ] Mobile app version
- [ ] Additional regions coverage
- [ ] Real-time NOTAM API integration (with credentials)

---

**Disclaimer**: This tool is for informational purposes only. Do not use for navigation, flight planning, or operational decisions. Always consult official sources and aviation authorities for accurate and up-to-date information.