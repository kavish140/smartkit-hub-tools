# AI Chatbot Setup Guide

Your AI Chatbot is now configured to work **completely client-side** without needing Vercel or any backend servers!

## ✅ How It Works

- **Google Gemini AI** handles all chat responses directly from the browser
- **ElevenLabs** provides text-to-speech voice capabilities
- **Web Speech API** enables voice input (speech recognition)
- All API calls are made directly from the user's browser
- No backend server required - works perfectly with GitHub Pages!

## 🔑 Setting Up Your API Keys

### Step 1: Add Your API Keys to `.env`

Open the `.env` file in your project root and add your keys:

```env
VITE_GEMINI_API_KEY=your_actual_gemini_key_here
VITE_ELEVENLABS_API_KEY=your_actual_elevenlabs_key_here
```

### Step 2: Get Your Free API Keys

#### Gemini API Key (Required for chat)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file
5. **Free tier**: Generous limits for personal projects

#### ElevenLabs API Key (Optional - for voice output)
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for a free account
3. Go to your profile settings
4. Copy your API key
5. Paste it in your `.env` file
6. **Free tier**: 10,000 characters/month

### Step 3: Deploy to GitHub Pages

Your API keys are loaded at build time and embedded in your production bundle. Here's how it works:

1. **Local Development**: Keys are loaded from `.env` file
2. **GitHub Actions Build**: Keys must be added as GitHub Secrets
3. **Production**: Keys are embedded in the built JavaScript

## 🚀 GitHub Secrets Configuration

To deploy with your API keys:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:
   - Name: `VITE_GEMINI_API_KEY`, Value: your Gemini key
   - Name: `VITE_ELEVENLABS_API_KEY`, Value: your ElevenLabs key

5. Update your GitHub Actions workflow to use these secrets:

```yaml
# In .github/workflows/deploy.yml
- name: Build
  run: npm run build
  env:
    VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
    VITE_ELEVENLABS_API_KEY: ${{ secrets.VITE_ELEVENLABS_API_KEY }}
```

## 🧪 Testing Locally

1. Add your API keys to `.env`
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open the AI Chatbot tool
4. Start chatting!

## 🎤 Features

- **Text Chat**: Type messages and get AI responses
- **Voice Input**: Click the microphone to speak your message
- **Voice Output**: Enable voice and select from multiple AI voices
- **System Prompts**: Customize how the AI behaves
- **Export Chat**: Download your conversation history
- **Local Storage**: Users can optionally add their own API keys in the browser

## ⚠️ Security Notes

### Is it safe to embed API keys in the frontend?

**Yes, but with caveats:**

1. **Domain Restrictions**: Set up API key restrictions in Google Cloud Console:
   - Restrict your Gemini key to only work from your domain
   - Go to Google Cloud Console → Credentials
   - Edit your API key → Add "HTTP referrers" restriction
   - Add: `https://yourdomain.com/*`

2. **Usage Quotas**: Set up daily quotas to prevent abuse:
   - Google Cloud Console → APIs & Services → Quotas
   - Set reasonable daily limits

3. **ElevenLabs**: Their API keys are designed for client-side use with built-in rate limiting

4. **Monitoring**: Regularly check your API usage dashboards

### Alternative: User-Provided Keys

Users can also provide their own API keys:
- Keys are stored in localStorage (browser only)
- Never sent to your servers
- Click "customize your own API keys" in the chatbot interface

## 📝 Optional: Environment Variables for Different Environments

Create multiple env files:

- `.env.local` - Your personal dev keys (gitignored)
- `.env.production` - Production keys (or use GitHub Secrets)
- `.env.example` - Template without real keys (commit this)

## 🎉 You're Done!

Your AI Chatbot is now:
- ✅ Fully functional
- ✅ Works without backend servers
- ✅ Compatible with GitHub Pages
- ✅ No Vercel needed
- ✅ Direct API integration
- ✅ Voice input and output enabled

Just add your API keys and start using it! 🚀
