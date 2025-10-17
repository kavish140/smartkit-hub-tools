# SmartKit Hub Tools

A comprehensive collection of **29 powerful web-based tools** for everyday tasks - all in one place!

🌐 **Live Demo:** `https://YOUR_USERNAME.github.io/YOUR_REPO/` (Update after deployment)

![SmartKit Hub Tools](https://img.shields.io/badge/Tools-29-brightgreen) ![Status](https://img.shields.io/badge/Status-Production%20Ready-success) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### 🧮 **Math & Calculations (3 tools)**
- **Calculator** - Full arithmetic operations with decimal support
- **Age Calculator** - Calculate exact age and time differences
- **GPA Calculator** - Track academic performance with multiple grading scales

### 🔄 **Converters (4 tools)**
- **Unit Converter** - Convert between 40+ units across 6 categories
- **Currency Converter** - Live exchange rates with 28+ currencies ⚡
- **File Converter** - Convert images between PNG, JPG, WebP
- **Audio Converter** - Convert audio files between multiple formats 🎵

### 🎲 **Generators (4 tools)**
- **QR Code Generator** - Create custom QR codes instantly
- **Password Generator** - Generate secure random passwords
- **UUID Generator** - Generate v1/v4 UUIDs
- **Chart Generator** - Create beautiful charts (bar, line, pie, doughnut) 📊

### 🔐 **Security & Encoding (2 tools)**
- **Hash Generator** - Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512
- **Base64 Encoder** - Encode and decode Base64 strings

### 💻 **Developer Tools (3 tools)**
- **JSON Formatter** - Format, validate, and minify JSON
- **Code Beautifier** - Format HTML, CSS, JavaScript
- **Email Validator** - Validate email addresses

### 🎨 **Design Tools (3 tools)**
- **Color Picker** - Convert between HEX, RGB, HSL
- **RGB to HEX** - Dedicated color converter with presets
- **Chart Generator** - Data visualization with multiple chart types

### 🛠️ **Utility Tools (6 tools)**
- **Text Counter** - Analyze text with word/character counts
- **Link Shortener** - Shorten URLs with TinyURL 🔗
- **Image Compressor** - Reduce image file sizes 🖼️
- **Pomodoro Timer** - Productivity timer with notifications ⏱️
- **World Clock** - View time across multiple timezones 🌍
- **Device Info** - Detect browser and system information

### 🌐 **API/Network Tools (5 tools)**
- **Weather Forecast** - Real-time weather data for any location ⛅
- **Crypto Prices** - Track live cryptocurrency prices 💰
- **News Feed** - Get latest news from various sources 📰
- **IP Lookup** - Find geolocation info for any IP address
- **YouTube Video Info** - Extract video metadata 🎥

---

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **React Router v6** - Client-side routing
- **Chart.js** - Data visualization
- **Web Audio API** - Audio processing

---

## 🎯 Key Features

- ✅ **29 Fully Functional Tools** - Every tool on the homepage works!
- ✅ **100% Client-Side** - Most tools work offline
- ✅ **Privacy-Focused** - No data collection or tracking
- ✅ **Mobile Responsive** - Works perfectly on all devices
- ✅ **Modern UI** - Beautiful gradient designs
- ✅ **Live APIs** - Weather, currency, crypto, news integration
- ✅ **Zero-Config** - 25 tools work immediately without setup
- ✅ **Production Ready** - Optimized and thoroughly tested

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Navigate to project
cd YOUR_REPO

# Install dependencies
npm install

# Start development server
npm run dev
```

Your app will be running at `http://localhost:8080/`

---

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🌐 Deployment to GitHub Pages

This project is pre-configured for automatic deployment to GitHub Pages!

### **Automatic Deployment (Recommended)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy SmartKit Hub Tools"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository Settings
   - Navigate to Pages
   - Under "Build and deployment", select **GitHub Actions**

3. **Done!** 
   - GitHub Actions will automatically build and deploy
   - Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### **Important: Update Base Path**

If your repository is NOT at `username.github.io`, update `vite.config.ts`:

```typescript
base: "/YOUR_REPO_NAME/",  // e.g., "/smartkit-hub-tools/"
```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 📝 API Keys (Optional)

Some tools work better with free API keys. **All tools work without keys**, but these enhance functionality:

### **Currency Converter** (Already Configured ✅)
- Live exchange rates for 28+ currencies
- No additional setup needed

### **Weather Forecast** (Already Configured ✅)
- Real-time weather data for any location
- No additional setup needed

### **News Feed** (Optional)
- Get free API key from [GNews](https://gnews.io/)
- 100 requests/day free tier
- Works in demo mode without key

### **YouTube Video Info** (Optional)
- Get free API key from [Google Cloud Console](https://console.cloud.google.com/)
- YouTube Data API v3
- Works in demo mode without key

---

## 🎨 Project Structure

```
smartkit-hub-tools/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Footer.tsx      # Footer component
│   │   ├── Hero.tsx        # Hero section
│   │   └── ToolsGrid.tsx   # Tools grid display
│   ├── pages/              # Tool pages (29 tools)
│   │   ├── Calculator.tsx
│   │   ├── UnitConverter.tsx
│   │   ├── AudioConverter.tsx
│   │   └── ... (26 more tools)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── .github/
│   └── workflows/          # GitHub Actions
│       └── deploy.yml      # Auto-deployment
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json            # Dependencies
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Chart.js](https://www.chartjs.org/) - Data visualization

---

## 📧 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Check the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Review the documentation files

---

## ⭐ Show Your Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

**Made with ❤️ using React, TypeScript, and Vite**

**Total Tools: 29 | Completion: 100% | Status: Production Ready** ✅
