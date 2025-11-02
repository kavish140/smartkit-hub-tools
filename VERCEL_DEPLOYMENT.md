# Deploying AI Chatbot Backend to Vercel

## Why Vercel?
- ✅ **100% Free** for personal projects
- ✅ **Serverless** - no server management needed
- ✅ **Secure** - API keys stored as environment variables
- ✅ **Fast** - global CDN
- ✅ **Easy** - Deploy from GitHub in 2 minutes

## Setup Instructions

### Step 1: Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via GitHub (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `smartkit-hub-tools` repository
5. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty

6. Add Environment Variables (click "Environment Variables"):
   ```
   GEMINI_API_KEY=AIzaSyC-BlgasLsoKLqN05QaDFJg0Ar-gFdjDxQ
   GEMINI_MODEL=gemini-2.0-flash-exp
   ELEVEN_API_KEY=sk_be8cacf10b4a8ec62da98453eabedfc3f24f18d13c6acc2c
   VOICE_ID=TxGEqnHWrfWFTfGW9XjX
   ELEVEN_MODEL=eleven_multilingual_v2
   ```

7. Click "Deploy"

#### Option B: Deploy via CLI
```bash
# From project root
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# Project name? smartkit-api
# Directory? ./
# Override settings? No

# Add environment variables
vercel env add GEMINI_API_KEY
vercel env add ELEVEN_API_KEY
vercel env add GEMINI_MODEL
vercel env add VOICE_ID
vercel env add ELEVEN_MODEL

# Deploy to production
vercel --prod
```

### Step 3: Get Your API URL

After deployment, Vercel will give you a URL like:
```
https://smartkit-api.vercel.app
```

Your API endpoints will be:
- `https://smartkit-api.vercel.app/api/chat`
- `https://smartkit-api.vercel.app/api/tts`
- `https://smartkit-api.vercel.app/api/voices`

### Step 4: Update Frontend

Update `src/pages/AIChatbot.tsx`:

```typescript
// Change this line:
const [apiUrl] = useState("http://localhost:3001/api");

// To your Vercel URL:
const [apiUrl] = useState("https://smartkit-api.vercel.app/api");
```

Or better, use environment variable in your build:

Create `.env.production`:
```
VITE_API_URL=https://smartkit-api.vercel.app/api
```

Then in `AIChatbot.tsx`:
```typescript
const [apiUrl] = useState(import.meta.env.VITE_API_URL || "http://localhost:3001/api");
```

### Step 5: Deploy Frontend to GitHub Pages

```bash
npm run build
git add .
git commit -m "Update API URL for production"
git push
```

GitHub Pages will automatically update.

## Testing Your Deployment

### Test API Endpoints:

**Chat endpoint:**
```bash
curl -X POST https://your-app.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

**Voices endpoint:**
```bash
curl https://your-app.vercel.app/api/voices
```

## Security Benefits

✅ **API keys never exposed** - They're environment variables on Vercel's servers
✅ **GitHub repo is clean** - No secrets in code
✅ **Easy rotation** - Update keys in Vercel dashboard anytime
✅ **CORS configured** - Only your domain can access the API
✅ **Rate limiting** - Vercel provides built-in DDoS protection

## Updating Environment Variables

To update API keys later:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Edit or add variables
5. Redeploy (automatic on next git push, or click "Redeploy" button)

## Cost

- **Vercel Free Tier:**
  - ✅ 100 GB bandwidth/month
  - ✅ Unlimited API requests
  - ✅ Serverless function execution time: 100 hours/month
  - ✅ More than enough for personal use

## Alternative: Render.com

If you prefer Render:
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `server`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add Environment Variables (same as above)
8. Deploy

Render gives you: `https://smartkit-api.onrender.com`

## Troubleshooting

**"API key not configured" error:**
- Check environment variables are set in Vercel dashboard
- Make sure you redeployed after adding env vars

**CORS errors:**
- Check `vercel.json` is in your repo root
- Verify API URL in frontend matches deployed URL

**Voice not working:**
- Check ElevenLabs API key is correct
- Verify you have credits/free tier on ElevenLabs account

**Deployment failed:**
- Check `api/*.js` files use ES modules (`export default`)
- Verify `vercel.json` is present

## What's Deployed

Your repository structure:
```
smartkit-hub-tools/
├── api/              ← Vercel deploys these as serverless functions
│   ├── chat.js       → /api/chat endpoint
│   ├── tts.js        → /api/tts endpoint
│   └── voices.js     → /api/voices endpoint
├── dist/             ← GitHub Pages serves this
│   └── index.html
├── src/              ← Your React app source
└── vercel.json       ← Vercel configuration
```

- **Vercel** hosts the API (serverless functions)
- **GitHub Pages** hosts the frontend (static files)
- They communicate via HTTPS

## Success!

Once deployed:
1. ✅ Users visit: `aismartkit.tech`
2. ✅ Chat sends requests to: `smartkit-api.vercel.app`
3. ✅ API keys stay secure on Vercel
4. ✅ Everything works without exposing secrets!
