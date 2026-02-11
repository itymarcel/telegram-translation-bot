import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { TelegramClient } from './services/telegram/TelegramClient.js';
import { OpenAITranslator } from './services/translation/OpenAITranslator.js';
import { MessageHandler } from './services/telegram/MessageHandler.js';
import chatsRouter from './routes/chats.js';
import translationsRouter from './routes/translations.js';
import configRouter from './routes/config.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_USE_WEBHOOK = process.env.TELEGRAM_USE_WEBHOOK === 'true';
const WEBHOOK_URL = process.env.WEBHOOK_URL; // e.g., https://your-app.up.railway.app

if (!OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

if (!TELEGRAM_BOT_TOKEN) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN is not set in environment variables');
  console.error('Get your token from @BotFather on Telegram');
  process.exit(1);
}

if (TELEGRAM_USE_WEBHOOK && !WEBHOOK_URL) {
  console.error('ERROR: WEBHOOK_URL is required when TELEGRAM_USE_WEBHOOK is true');
  console.error('Set WEBHOOK_URL to your Railway backend URL (e.g., https://your-app.up.railway.app)');
  process.exit(1);
}

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.set('trust proxy', 1); // Trust Railway's proxy
app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Initialize services
const translator = new OpenAITranslator(OPENAI_API_KEY, OPENAI_MODEL);
const telegramClient = new TelegramClient(
  TELEGRAM_BOT_TOKEN,
  {
    onReady: (botInfo) => {
      console.log('Telegram bot ready:', botInfo);
      io.emit('telegram-ready', botInfo);
    },
    onMessage: async (message) => {
      console.log('Message received from Telegram');
      const messageHandler = new MessageHandler(telegramClient, translator);
      await messageHandler.handleMessage(message);
      io.emit('message-received', {
        chatId: message.chat.id.toString(),
        message: message.text,
      });
    },
    onError: (error) => {
      console.error('Telegram error:', error);
      io.emit('telegram-error', error.message);
    },
  },
  {
    useWebhook: TELEGRAM_USE_WEBHOOK,
    webhookUrl: WEBHOOK_URL,
  }
);

// Webhook endpoint for Telegram (must be before other routes to avoid rate limiting)
app.post('/api/telegram/webhook', (req, res) => {
  try {
    telegramClient.processUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook update:', error);
    res.sendStatus(500);
  }
});

// API Routes
app.use('/api/chats', chatsRouter);
app.use('/api/translations', translationsRouter);
app.use('/api/config', configRouter);

// Telegram status endpoint
app.get('/api/config/telegram-status', (_req, res) => {
  const status = telegramClient.getStatus();
  res.json({
    success: true,
    data: status,
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current Telegram status on connection
  const status = telegramClient.getStatus();
  socket.emit('telegram-status', status);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start server
async function start() {
  try {
    // Start HTTP server first
    httpServer.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log(`WebSocket server ready`);
    });

    // Initialize Telegram bot
    await telegramClient.initialize();

    console.log('✅ Telegram Translation Bot is ready!');
    console.log(`📱 Start chatting with your bot on Telegram`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await telegramClient.destroy();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

start();
