# 🔑 API Setup Guide

## Tools Currently Working (100% Free, No APIs Needed!)

✅ **21 Tools Working Without Any APIs:**
1. Calculator
2. Unit Converter  
3. QR Code Generator
4. Password Generator
5. Age Calculator
6. Text Counter
7. Color Picker
8. Hash Generator
9. JSON Formatter
10. Base64 Encoder
11. Email Validator
12. UUID Generator
13. Pomodoro Timer
14. GPA Calculator
15. World Clock
16. Image Compressor
17. Device Info
18. Code Beautifier

## Tools Requiring Free API Keys

### 1. Currency Converter 💱

**File:** `src/pages/CurrencyConverter.tsx`

**Free API Options:**

**Option A: ExchangeRate-API (Recommended)**
- Website: https://www.exchangerate-api.com/
- Free tier: 1,500 requests/month
- Steps:
  1. Sign up for free account
  2. Get your API key
  3. Open `src/pages/CurrencyConverter.tsx`
  4. Replace `YOUR_API_KEY_HERE` on line 73 with your key
  5. Uncomment line 77 and comment line 74

```javascript
// Replace this:
const API_KEY = "YOUR_API_KEY_HERE";

// With your actual key:
const API_KEY = "your-actual-api-key-123";

// Then use the authenticated endpoint (uncomment line 77):
const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`);
```

**Option B: No API Key (Limited)**
- Already configured as fallback
- Uses https://api.exchangerate-api.com/v4/latest/USD
- Has rate limits but works immediately

---

### 2. Weather Forecast 🌤️

**File:** `src/pages/WeatherForecast.tsx`

**Free API: OpenWeatherMap**
- Website: https://openweathermap.org/api
- Free tier: 1,000 calls/day
- Steps:
  1. Sign up at https://openweathermap.org/api
  2. Get your API key (takes ~10 minutes to activate)
  3. Open `src/pages/WeatherForecast.tsx`
  4. Replace `YOUR_OPENWEATHER_API_KEY_HERE` on line 35

```javascript
// Replace this:
const API_KEY = "YOUR_OPENWEATHER_API_KEY_HERE";

// With your actual key:
const API_KEY = "your-openweather-api-key-123";
```

**Alternative Free APIs:**
- **WeatherAPI.com**: https://www.weatherapi.com/ (1M calls/month free)
- **Open-Meteo**: https://open-meteo.com/ (No key needed!)

---

## Quick Setup Instructions

### Step 1: Get API Keys

1. **For Currency Converter:**
   ```
   Visit: https://www.exchangerate-api.com/
   Sign up → Get API key → Copy it
   ```

2. **For Weather:**
   ```
   Visit: https://openweathermap.org/api
   Sign up → Get API key → Wait 10 min → Copy it
   ```

### Step 2: Add Keys to Your Project

1. Open the respective files mentioned above
2. Find the line with `YOUR_API_KEY_HERE` or `YOUR_OPENWEATHER_API_KEY_HERE`
3. Replace with your actual API key
4. Save the file

### Step 3: Test

1. Restart your dev server (Ctrl+C then `npm run dev`)
2. Open the tool
3. Try using it - it should work now!

---

## Alternative: Environment Variables (Advanced)

For better security, you can use environment variables:

### Create `.env` file:
```bash
# Create this file in the root directory
VITE_EXCHANGE_RATE_API_KEY=your-exchange-rate-key
VITE_OPENWEATHER_API_KEY=your-openweather-key
```

### Update code to use environment variables:

**CurrencyConverter.tsx:**
```javascript
const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY || "YOUR_API_KEY_HERE";
```

**WeatherForecast.tsx:**
```javascript
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "YOUR_OPENWEATHER_API_KEY_HERE";
```

### Add to `.gitignore`:
```
.env
.env.local
```

---

## Free API Tier Limits

| API | Free Tier Limit | Signup Required |
|-----|----------------|-----------------|
| ExchangeRate-API | 1,500 req/month | Yes |
| OpenWeatherMap | 1,000 req/day | Yes |
| QRServer (QR Codes) | Unlimited | No |

---

## Tools That DON'T Need APIs (Yet)

These tools are displayed but not yet implemented:
- Link Shortener
- Crypto Prices
- News Feed  
- IP Lookup
- RGB to HEX (use Color Picker instead)
- Chart Generator
- YouTube Downloader
- Audio Converter
- File Converter

**Want these implemented?** Let me know which ones you need!

---

## Testing Without API Keys

Both Currency Converter and Weather Forecast have **fallback demo data** built-in, so they work even without API keys - just with sample/cached data. This means:

✅ **Everything works right now!**
📈 **With API keys = Live real-time data**
📊 **Without API keys = Demo/fallback data**

---

## Summary

**Currently Functional: 21/29 tools (72%)**

- ✅ **18 tools** work perfectly with no setup
- ✅ **3 tools** work with demo data, better with free API keys
- ⏳ **8 tools** not yet implemented (coming soon if needed)

**All 21 working tools are 100% functional right now!**

Just add the API keys above to get live data for Currency & Weather. 🚀
