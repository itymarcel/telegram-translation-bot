# Telegram Translation Bot 🤖🇮🇹🇬🇧

Your personal Telegram bot that instantly translates between Italian and English using OpenAI GPT-4.

## ✨ Features

- **Instant Translation**: Send a message in Italian or English, get back the translation
- **Automatic Language Detection**: No need to specify the language
- **Private Bot**: Only you can use it (unless you share the username)
- **Translation History**: View all your translations in the web dashboard
- **Statistics**: Track your usage and learning progress
- **Simple Setup**: Create your bot in 5 minutes

## 🚀 Quick Start

### 1. Create Your Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` and follow the instructions
3. Save your bot token (looks like `123456789:ABC...`)

### 2. Install & Configure

```bash
cd whatsapp-cli
npm install

# Add your tokens to backend/.env
TELEGRAM_BOT_TOKEN=your-bot-token-here
OPENAI_API_KEY=your-openai-key-here
```

### 3. Start the Server

```bash
npm run dev
```

### 4. Start Translating!

1. Search for your bot on Telegram (e.g., @mytranslation_bot)
2. Click START
3. Send: "Ciao! Come stai?"
4. Get: "Hello! How are you?"

**That's it!** 🎉

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Telegram account
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

## 📖 Detailed Setup

See [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) for step-by-step instructions with screenshots.

## 💬 Example Usage

```
You: Ciao! Come stai oggi?
Bot: Hello! How are you today?

You: I would like a coffee please
Bot: Vorrei un caffè per favore

You: Dov'è il bagno?
Bot: Where is the bathroom?

You: What's the weather like?
Bot: Com'è il tempo?
```

## 🖥️ Web Dashboard

Open `http://localhost:5173` to view:

- **Real-time bot status**
- **All your chats** with the bot
- **Translation history** searchable and filterable
- **Statistics** (total translations, language distribution)
- **Settings** (update API keys)

## 🛠️ Tech Stack

- **Bot Platform**: Telegram Bot API
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript + Vite
- **Translation**: OpenAI GPT-4
- **Database**: SQLite
- **Real-time**: Socket.IO

## 📁 Project Structure

```
whatsapp-cli/
├── backend/          # Express server
│   ├── src/
│   │   ├── services/
│   │   │   ├── telegram/      # Telegram bot integration
│   │   │   ├── translation/   # OpenAI GPT-4 translator
│   │   │   └── storage/       # SQLite database
│   │   ├── routes/            # REST API endpoints
│   │   └── server.ts          # Main entry point
│   └── .env                   # Configuration
│
├── frontend/         # React dashboard
│   └── src/
│       ├── pages/             # Dashboard, Chats, etc.
│       ├── hooks/             # WebSocket integration
│       └── services/          # API client
│
└── shared/           # TypeScript types
```

## 🔧 Configuration

### Backend (.env)

```env
PORT=3000
NODE_ENV=development

# Telegram Bot Token (from @BotFather)
TELEGRAM_BOT_TOKEN=your-bot-token-here

# OpenAI API Key
OPENAI_API_KEY=your-openai-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Database
DATABASE_PATH=./data/database.sqlite

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## 📡 API Endpoints

### Chats
- `GET /api/chats` - List all conversations
- `GET /api/chats/:chatId` - Get chat details
- `GET /api/chats/:chatId/messages` - Translation history

### Translations
- `GET /api/translations` - All translations (paginated)
- `GET /api/translations/stats` - Statistics

### Config
- `GET /api/config/telegram-status` - Bot connection status
- `PUT /api/config/api-keys` - Update OpenAI API key

## 🤔 Troubleshooting

### Bot doesn't respond
- Make sure backend server is running (`npm run dev`)
- Check `TELEGRAM_BOT_TOKEN` in backend/.env is correct
- Try sending `/start` to the bot first
- Look at backend logs for errors

### Translation errors
- Verify `OPENAI_API_KEY` is correct in backend/.env
- Check you have credits at https://platform.openai.com
- Review backend console for error messages

### "Bot not found"
- Wait a few minutes after creating the bot
- Make sure username ends in "bot"
- Check for typos in the bot username

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -ti:3000 | xargs kill -9

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🔒 Security & Privacy

- ✅ Bot is **private** by default (only you can use it)
- ✅ Messages processed through OpenAI API (see their [privacy policy](https://openai.com/privacy))
- ✅ Translation history stored **locally** in SQLite
- ✅ Bot token is secret - never commit to git (.gitignore configured)
- ✅ API keys stored in `.env` files (gitignored)

## ☁️ Deploy to Production

### Railway (Recommended)

Deploy your bot to run 24/7:

```bash
# 1. Push to GitHub
git push

# 2. Connect to Railway
# (railway.app - sign in with GitHub)

# 3. Add environment variables in Railway:
TELEGRAM_BOT_TOKEN=your-token
OPENAI_API_KEY=your-key

# Done! ✅
```

**Your bot will be live in ~5 minutes!**

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed instructions.

**Cost:** Free tier ($5/month credit) is more than enough!

## 🚀 Development

### Backend Development

```bash
cd backend
npm run dev    # Auto-restarts on changes
```

### Frontend Development

```bash
cd frontend
npm run dev    # Hot reload enabled
```

### Type Checking

```bash
npm run typecheck
```

### Building for Production

```bash
npm run build
npm run start
```

## ⏳ Roadmap (Phase 2)

- [ ] Word-of-hour feature (scheduled vocabulary delivery)
- [ ] Support for more language pairs (Spanish, French, German)
- [ ] Voice message transcription and translation
- [ ] Image text extraction (OCR) and translation
- [ ] Export translation history
- [ ] Mobile app

## 📚 Documentation

- [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) - Detailed setup instructions
- [QUICKSTART.md](./QUICKSTART.md) - Fast setup guide
- [STATUS.md](./STATUS.md) - Project status and features
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical architecture

## 🐛 Known Issues

- Telegram doesn't have typing indicators (limitation of the API)
- First translation may be slower (OpenAI cold start)

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your needs!

## 📝 License

MIT

## ❓ FAQ

**Q: Can others use my bot?**
A: Only if you share the bot username. By default, it's private to you.

**Q: Does this work on mobile?**
A: Yes! Telegram works on all devices. The dashboard is web-based.

**Q: How much does it cost?**
A: You only pay for OpenAI API usage (typically <$0.01 per translation).

**Q: Can I use this for other languages?**
A: Currently Italian ↔ English only. Phase 2 will add more languages.

**Q: Is my data private?**
A: Messages are sent to OpenAI for translation. History stored locally.

## 🎉 Enjoy Your Translation Bot!

Start chatting with your bot on Telegram and learn Italian! 🇮🇹

---

Made with ❤️ using OpenAI GPT-4
