# AI Chatbot Server Setup

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure API Keys
Your API keys are already in `server/.env`:
- ✅ Gemini API Key configured
- ✅ ElevenLabs API Key configured

### 3. Start the Server
```bash
npm start
```

The API server will run on **http://localhost:3001**

### 4. Development Mode (with auto-restart)
```bash
npm run dev
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status

### Chat with AI
```
POST /api/chat
Body: {
  "message": "Your question here",
  "systemPrompt": "Optional custom system prompt"
}
```
Returns AI response from Gemini

### Text-to-Speech
```
POST /api/tts
Body: {
  "text": "Text to convert to speech",
  "voiceId": "Optional voice ID (defaults to Arnold)"
}
```
Returns audio/mpeg stream

### Get Available Voices
```
GET /api/voices
```
Returns list of available ElevenLabs voices

## Usage with Frontend

1. Start the server: `npm start` (in server directory)
2. Start the frontend: `npm run dev` (in root directory)
3. Navigate to http://localhost:8080/ai-chatbot
4. Start chatting!

## Security Notes

- API keys are stored in `.env` file (not committed to git)
- Keys are only used on the backend
- Frontend never sees the actual API keys
- CORS is enabled for local development

## Production Deployment

For production, deploy the server to:
- Railway.app
- Render.com
- Vercel (serverless functions)
- Your own VPS

Update the `apiUrl` in `AIChatbot.tsx` to point to your production server.

## Troubleshooting

**Server won't start:**
- Make sure port 3001 is not in use
- Check that `.env` file exists with valid API keys
- Run `npm install` again

**Frontend can't connect:**
- Verify server is running on port 3001
- Check browser console for CORS errors
- Ensure `apiUrl` in frontend matches server URL

**Voice not working:**
- Check ElevenLabs API key in `.env`
- Verify voice is enabled in frontend
- Check ElevenLabs API quota

## API Key Management

To update API keys, edit `server/.env`:
```env
GEMINI_API_KEY=your_gemini_key_here
ELEVEN_API_KEY=your_elevenlabs_key_here
```

Then restart the server.
