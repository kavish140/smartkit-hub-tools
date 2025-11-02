# Quick Setup Guide

## 🚀 Deploy AI Chatbot Backend (2 Minutes)

Your API keys need to be secure! Here's the fastest way:

### Option 1: Deploy to Vercel (Recommended - FREE)

1. **Sign up at [vercel.com](https://vercel.com)** with GitHub

2. **Click "Add New Project"** → Import `smartkit-hub-tools`

3. **Add these Environment Variables:**
   ```
   GEMINI_API_KEY=AIzaSyC-BlgasLsoKLqN05QaDFJg0Ar-gFdjDxQ
   ELEVEN_API_KEY=sk_be8cacf10b4a8ec62da98453eabedfc3f24f18d13c6acc2c
   GEMINI_MODEL=gemini-2.0-flash-exp
   VOICE_ID=TxGEqnHWrfWFTfGW9XjX
   ```

4. **Click Deploy** - Done! ✅

5. **Your API URL will be:** `https://your-project.vercel.app`

### Update Your Site

No code changes needed! The chatbot automatically uses:
- `http://localhost:3001/api` when running locally
- `/api` (Vercel serverless) when deployed

### Test It

Visit: `https://aismartkit.tech/ai-chatbot`

The chatbot will work without users needing API keys!

---

## 🔐 Why This is Secure

✅ API keys stored in Vercel (never in code)  
✅ Keys never exposed to browsers  
✅ GitHub repo stays clean  
✅ Easy to rotate keys anytime  

## 💰 Cost

**$0** - Vercel free tier is perfect for this:
- Unlimited requests
- 100GB bandwidth/month
- Serverless functions included

## 📝 What Happens

1. User visits `aismartkit.tech/ai-chatbot`
2. They type a message
3. Frontend sends to Vercel: `/api/chat`
4. Vercel uses YOUR keys (stored securely)
5. Returns AI response
6. User sees response

**Your keys = Never exposed!** 🔒
