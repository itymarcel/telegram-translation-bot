# Telegram Translation Bot

A personal Telegram bot that translates messages between Italian and English using OpenAI GPT-4.

**Chat with your bot → Get instant translations!**

## Features

- **Automatic Translation**: Messages are automatically translated between Italian and English
- **WhatsApp Web Integration**: Connects via QR code using whatsapp-web.js
- **Real-time Updates**: WebSocket-based real-time notifications
- **Translation History**: Complete history of all translations
- **Chat Management**: View and manage all active chats
- **Statistics Dashboard**: Track translation usage and activity

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Vite
- **WhatsApp**: whatsapp-web.js
- **Translation**: OpenAI GPT-4 API
- **Database**: SQLite with better-sqlite3
- **Real-time**: Socket.IO

## Prerequisites

- Node.js 18+ and npm 9+
- OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/api-keys))
- WhatsApp account

## Installation

1. **Clone and install dependencies:**

```bash
cd whatsapp-cli
npm install
```

2. **Configure environment variables:**

Backend configuration:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

Frontend configuration:
```bash
cd ../frontend
cp .env.example .env
```

The default frontend configuration should work:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## Usage

### Start the Application

From the root directory:

```bash
npm run dev
```

This will start both the backend server (port 3000) and frontend dev server (port 5173).

### Connect WhatsApp

1. Open your browser and navigate to `http://localhost:5173`
2. You'll see a QR code on the dashboard
3. Open WhatsApp on your phone
4. Go to Settings > Linked Devices > Link a Device
5. Scan the QR code displayed in the browser
6. Wait for the connection to establish (status will change to "Connected")

### Start Translating

Once connected, the app will automatically:
1. Listen for incoming messages on WhatsApp
2. Detect the language (Italian or English)
3. Translate to the opposite language
4. Send the translation back as a reply
5. Store the translation in the database

## Project Structure

```
whatsapp-cli/
├── backend/                    # Express server
│   ├── src/
│   │   ├── services/
│   │   │   ├── whatsapp/      # WhatsApp integration
│   │   │   ├── translation/   # OpenAI translation
│   │   │   └── storage/       # Database operations
│   │   ├── routes/            # API routes
│   │   └── server.ts          # Entry point
│   └── data/                  # SQLite DB (auto-created)
├── frontend/                   # React app
│   └── src/
│       ├── components/        # React components
│       ├── pages/             # Page components
│       ├── hooks/             # Custom hooks
│       ├── services/          # API client
│       └── store/             # Zustand store
└── shared/                    # Shared TypeScript types
```

## API Endpoints

### Chats
- `GET /api/chats` - List all active chats
- `GET /api/chats/:chatId` - Get chat details
- `GET /api/chats/:chatId/messages` - Get translation history for a chat
- `PUT /api/chats/:chatId/settings` - Update chat settings

### Translations
- `GET /api/translations` - Get all translations (paginated)
- `GET /api/translations/stats` - Get translation statistics

### Configuration
- `GET /api/config` - Get current configuration
- `GET /api/config/whatsapp-status` - Get WhatsApp connection status
- `PUT /api/config/api-keys` - Update OpenAI API key

## WebSocket Events

The server emits the following events:
- `qr-code` - QR code data for authentication
- `authenticated` - WhatsApp authenticated
- `ready` - Client ready to send/receive messages
- `message-received` - New message received
- `disconnected` - WhatsApp disconnected

## Troubleshooting

### QR Code Not Appearing
- Make sure the backend server is running
- Check the browser console for errors
- Ensure you have a stable internet connection

### WhatsApp Connection Issues
- If authentication fails, delete `backend/data/.wwebjs_auth` and restart
- Make sure you're not already logged in on another device
- Some WhatsApp accounts have device limits

### Translation Not Working
- Verify your OpenAI API key is correct in `backend/.env`
- Check that you have sufficient credits in your OpenAI account
- Look at backend logs for error messages

### Database Issues
- The database is auto-created on first run
- If you need to reset, delete `backend/data/database.sqlite`

## Development

### Backend Development

```bash
cd backend
npm run dev
```

The server will restart automatically on code changes.

### Frontend Development

```bash
cd frontend
npm run dev
```

Vite provides hot module replacement for instant updates.

### Type Checking

```bash
npm run typecheck
```

### Building for Production

```bash
npm run build
npm run start
```

## Security Considerations

- API keys are stored in `.env` files (never commit these!)
- Rate limiting is enabled on API endpoints
- Input validation using Zod
- CORS configured for the frontend URL only

## Future Enhancements (Phase 2)

- **Word-of-Hour Feature**: Scheduled vocabulary delivery
- **Multiple Languages**: Support for more language pairs
- **Voice Messages**: Transcription and translation
- **Export History**: Download translation history
- **Analytics Dashboard**: Detailed usage statistics

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
