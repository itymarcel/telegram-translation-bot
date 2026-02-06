import TelegramBot from 'node-telegram-bot-api';
import type { OpenAITranslator } from '../translation/OpenAITranslator.js';
import type { TelegramClient } from './TelegramClient.js';
import { ChatModel } from '../storage/ChatModel.js';
import { TranslationModel } from '../storage/TranslationModel.js';

export class MessageHandler {
  constructor(
    private telegramClient: TelegramClient,
    private translator: OpenAITranslator
  ) {}

  async handleMessage(message: TelegramBot.Message): Promise<void> {
    try {
      const chatId = message.chat.id.toString();
      const text = message.text;

      if (!text) {
        return;
      }

      const userName = message.from?.first_name || 'Unknown';
      const userHandle = message.from?.username || message.from?.id.toString() || 'Unknown';

      console.log(`Processing message from ${userName} (@${userHandle}): ${text}`);

      // Upsert chat
      ChatModel.upsert({
        id: chatId,
        contact_name: userName,
        contact_number: userHandle,
        is_active: true,
        word_of_hour_enabled: false,
      });

      // Show typing indicator
      // Note: Telegram doesn't have a typing indicator in the API like WhatsApp

      // Detect language and translate
      const { translation, sourceLang, targetLang } = await this.translator.translateWithDetection(text);

      // Store translation (sourceLang and targetLang are validated by translator)
      const direction = sourceLang === 'it' ? 'it_to_en' : 'en_to_it';
      TranslationModel.create({
        chat_id: chatId,
        original_text: text,
        translated_text: translation,
        source_language: sourceLang as 'it' | 'en',
        target_language: targetLang as 'it' | 'en',
        direction,
      });

      // Send translated message back
      await this.telegramClient.sendMessage(chatId, translation);

      console.log(`Translation sent: ${translation}`);
    } catch (error) {
      console.error('Error handling message:', error);

      // Send error message to user
      try {
        await this.telegramClient.sendMessage(
          message.chat.id,
          'Sorry, I encountered an error processing your message. Please try again.'
        );
      } catch (sendError) {
        console.error('Error sending error message:', sendError);
      }
    }
  }
}
