# AI Chatbot Features & Setup

## Overview
Advanced AI chatbot powered by Google Gemini AI with voice input/output capabilities using ElevenLabs text-to-speech.

## Key Features

### 1. **Text Chat Interface**
- Real-time messaging with Google Gemini AI
- Conversation history display
- Message timestamps
- Copy individual messages
- Export entire chat as text file
- Clear conversation option

### 2. **Voice Input (Speech Recognition)**
- Click microphone button to start voice recording
- Automatic speech-to-text conversion
- Uses browser's built-in Web Speech API (no additional API needed)
- Visual feedback when listening
- Works in Chrome, Edge, Safari

### 3. **Voice Output (Text-to-Speech)**
- Powered by ElevenLabs AI voices
- 5 premium voice options:
  - Arnold (Deep Male) - Default from your Jarvis code
  - George (British Male)
  - Sarah (Female)
  - Rachel (Female)
  - Adam (Male)
- Toggle voice on/off
- Stop audio playback button
- High-quality, natural-sounding speech

### 4. **Customization Options**
- **System Prompt**: Define AI personality and behavior
- **Voice Selection**: Choose from 5 different voices
- **API Key Management**: Save keys locally in browser
- **Voice Toggle**: Enable/disable audio responses

### 5. **API Integration**
- **Gemini API**: Powers the AI responses (required)
  - Get key: https://aistudio.google.com/app/apikey
  - Uses latest `gemini-2.0-flash-exp` model
  
- **ElevenLabs API**: Powers voice generation (optional)
  - Get key: https://elevenlabs.io/
  - Free tier: 10,000 characters/month
  - Paid plans available for more usage

## How to Use

### Setup (One-time)
1. Navigate to `/ai-chatbot` on your website
2. Get your API keys:
   - **Gemini**: https://aistudio.google.com/app/apikey (Free)
   - **ElevenLabs**: https://elevenlabs.io/ (Free tier available)
3. Enter both API keys in the form
4. Click "Save API Keys Locally" (stored in browser localStorage)

### Text Chat
1. Type your message in the input box
2. Press Enter or click Send button
3. AI responds instantly
4. View conversation history above

### Voice Chat (Gemini Live-like experience)
1. Toggle "Enable Voice Output" switch
2. Select your preferred voice from dropdown
3. Click the microphone button
4. Speak your question
5. AI transcribes, responds, and speaks the answer
6. Click stop button to interrupt audio

### Export & Management
- **Copy Message**: Click copy icon on any message
- **Export Chat**: Download full conversation as `.txt` file
- **Clear Chat**: Remove all messages and start fresh

## Technical Details

### Browser Support
- **Voice Input**: Chrome, Edge, Safari (Web Speech API)
- **Voice Output**: All modern browsers (plays MP3)
- **Best Experience**: Chrome/Edge on desktop

### API Keys Security
- Keys stored in browser's localStorage only
- Never sent to your server
- Keys included in API requests to Gemini/ElevenLabs directly
- For production: Consider implementing a backend proxy

### Voice Models
- **ElevenLabs Model**: `eleven_multilingual_v2`
- Supports 29 languages
- Adjustable stability and similarity settings (hardcoded to optimal values)

### Rate Limits
- **Gemini Free Tier**: 15 requests/minute, 1,500/day
- **ElevenLabs Free**: 10,000 characters/month
- **ElevenLabs Paid**: Starting at $5/month for 30,000 chars

## Improvements Over Original Jarvis Code

1. ✅ **Web-Based**: No Python installation needed, runs in browser
2. ✅ **Better UI**: Clean, modern chat interface with message history
3. ✅ **Voice Selection**: Multiple voices vs single hardcoded voice
4. ✅ **Message Management**: Copy, export, clear conversations
5. ✅ **Custom System Prompts**: Change AI personality on the fly
6. ✅ **Better Error Handling**: User-friendly error messages
7. ✅ **Persistent Settings**: API keys saved locally
8. ✅ **Mobile Friendly**: Responsive design for all devices
9. ✅ **No Installation**: Access from any device with a browser

## Future Enhancements (Optional)

- [ ] Real-time streaming responses (Server-Sent Events)
- [ ] Multi-language support for voice input
- [ ] Conversation saving to cloud (requires backend)
- [ ] Voice activity detection (auto-start listening)
- [ ] Custom voice training (ElevenLabs Voice Lab)
- [ ] Integration with other AI models (Claude, GPT-4)
- [ ] File upload for vision/document analysis
- [ ] Function calling for web searches, calculations

## Notes

- Voice input quality depends on microphone and environment
- ElevenLabs voices require internet connection
- First voice generation may have slight delay while loading
- For best results, speak clearly and minimize background noise
