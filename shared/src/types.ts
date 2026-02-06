export interface Chat {
  id: string;
  contact_name: string;
  contact_number: string;
  is_active: boolean;
  word_of_hour_enabled: boolean;
  created_at: string;
  last_message_at: string;
}

export interface Translation {
  id: number;
  chat_id: string;
  original_text: string;
  translated_text: string;
  source_language: 'it' | 'en';
  target_language: 'it' | 'en';
  direction: 'it_to_en' | 'en_to_it';
  timestamp: string;
}

export interface WordOfHour {
  id: number;
  chat_id: string;
  word: string;
  translation: string;
  context: string;
  pronunciation: string;
  scheduled_for: string;
  delivered: boolean;
  delivered_at: string | null;
}

export interface Config {
  key: string;
  value: string;
}

export interface TelegramStatus {
  connected: boolean;
  ready: boolean;
  botUsername?: string;
  botName?: string;
}

export interface MessageEvent {
  chatId: string;
  message: string;
  timestamp: string;
  from: string;
}

export interface TranslationStats {
  total_translations: number;
  it_to_en: number;
  en_to_it: number;
  total_chats: number;
  active_chats: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type Language = 'it' | 'en' | 'unknown';

export interface DetectedLanguage {
  language: Language;
  confidence: number;
}
