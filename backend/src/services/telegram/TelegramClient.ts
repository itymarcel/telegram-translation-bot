import TelegramBot from 'node-telegram-bot-api';
import type { TelegramStatus } from 'shared';

export type TelegramEventCallback = {
  onReady?: (botInfo: { username: string; name: string }) => void;
  onMessage?: (message: TelegramBot.Message) => void;
  onError?: (error: Error) => void;
};

export class TelegramClient {
  private bot: TelegramBot;
  private status: TelegramStatus;
  private callbacks: TelegramEventCallback;

  constructor(token: string, callbacks: TelegramEventCallback = {}) {
    this.callbacks = callbacks;
    this.status = {
      connected: false,
      ready: false,
    };

    // Initialize bot
    this.bot = new TelegramBot(token, { polling: true });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Handle polling errors
    this.bot.on('polling_error', (error) => {
      console.error('Telegram polling error:', error);
      this.callbacks.onError?.(error);
    });

    // Handle incoming messages
    this.bot.on('message', (msg) => {
      // Only process text messages
      if (msg.text && !msg.text.startsWith('/')) {
        this.callbacks.onMessage?.(msg);
      }
    });

    // Handle /start command
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const welcomeMessage = `
Welcome to the Italian-English Translation Bot! 🇮🇹 🇬🇧

Send me a message in Italian or English, and I'll translate it for you!

Examples:
• Ciao! Come stai? → Hello! How are you?
• Good morning! → Buongiorno!

Just start sending messages to get translations.
      `.trim();

      this.bot.sendMessage(chatId, welcomeMessage);
    });

    // Handle /help command
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      const helpMessage = `
Translation Bot Help 🤖

How to use:
1. Send any message in Italian or English
2. I'll automatically detect the language
3. You'll receive a translation in the other language

Features:
• Italian → English translation
• English → Italian translation
• Automatic language detection
• Translation history saved

Commands:
/start - Start the bot
/help - Show this help message
/stats - Show your translation statistics
      `.trim();

      this.bot.sendMessage(chatId, helpMessage);
    });
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing Telegram bot...');

      // Get bot info
      const botInfo = await this.bot.getMe();

      this.status.connected = true;
      this.status.ready = true;
      this.status.botUsername = botInfo.username;
      this.status.botName = `${botInfo.first_name}`;

      console.log(`Telegram bot ready: @${botInfo.username}`);
      console.log(`Bot name: ${botInfo.first_name}`);

      this.callbacks.onReady?.({
        username: botInfo.username || '',
        name: botInfo.first_name,
      });
    } catch (error) {
      console.error('Failed to initialize Telegram bot:', error);
      throw error;
    }
  }

  async sendMessage(chatId: number | string, message: string): Promise<void> {
    try {
      await this.bot.sendMessage(chatId, message);
      console.log(`Message sent to ${chatId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  getStatus(): TelegramStatus {
    return { ...this.status };
  }

  isReady(): boolean {
    return this.status.ready;
  }

  async destroy(): Promise<void> {
    await this.bot.stopPolling();
  }
}
