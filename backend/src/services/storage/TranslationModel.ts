import db from './database.js';
import type { Translation, TranslationStats, Language } from 'shared';

export class TranslationModel {
  static getAll(page = 1, limit = 50): { translations: Translation[]; total: number } {
    const offset = (page - 1) * limit;

    const countStmt = db.prepare('SELECT COUNT(*) as count FROM translations');
    const { count } = countStmt.get() as { count: number };

    const stmt = db.prepare(`
      SELECT * FROM translations
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `);

    const translations = stmt.all(limit, offset) as Translation[];

    return { translations, total: count };
  }

  static getByChatId(chatId: string, page = 1, limit = 50): { translations: Translation[]; total: number } {
    const offset = (page - 1) * limit;

    const countStmt = db.prepare('SELECT COUNT(*) as count FROM translations WHERE chat_id = ?');
    const { count } = countStmt.get(chatId) as { count: number };

    const stmt = db.prepare(`
      SELECT * FROM translations
      WHERE chat_id = ?
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `);

    const translations = stmt.all(chatId, limit, offset) as Translation[];

    return { translations, total: count };
  }

  static create(translation: Omit<Translation, 'id' | 'timestamp'>): Translation {
    const stmt = db.prepare(`
      INSERT INTO translations (
        chat_id, original_text, translated_text,
        source_language, target_language, direction
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      translation.chat_id,
      translation.original_text,
      translation.translated_text,
      translation.source_language,
      translation.target_language,
      translation.direction
    );

    const getStmt = db.prepare('SELECT * FROM translations WHERE id = ?');
    return getStmt.get(result.lastInsertRowid) as Translation;
  }

  static getStats(): TranslationStats {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM translations');
    const { count: total_translations } = totalStmt.get() as { count: number };

    const itToEnStmt = db.prepare('SELECT COUNT(*) as count FROM translations WHERE direction = ?');
    const { count: it_to_en } = itToEnStmt.get('it_to_en') as { count: number };

    const enToItStmt = db.prepare('SELECT COUNT(*) as count FROM translations WHERE direction = ?');
    const { count: en_to_it } = enToItStmt.get('en_to_it') as { count: number };

    const totalChatsStmt = db.prepare('SELECT COUNT(*) as count FROM chats');
    const { count: total_chats } = totalChatsStmt.get() as { count: number };

    const activeChatsStmt = db.prepare('SELECT COUNT(*) as count FROM chats WHERE is_active = 1');
    const { count: active_chats } = activeChatsStmt.get() as { count: number };

    return {
      total_translations,
      it_to_en,
      en_to_it,
      total_chats,
      active_chats,
    };
  }

  static getCached(text: string, sourceLang: Language, targetLang: Language): string | null {
    const stmt = db.prepare(`
      SELECT translated_text FROM translation_cache
      WHERE original_text = ? AND source_language = ? AND target_language = ?
    `);

    const result = stmt.get(text, sourceLang, targetLang) as { translated_text: string } | undefined;
    return result?.translated_text || null;
  }

  static cache(text: string, translatedText: string, sourceLang: Language, targetLang: Language): void {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO translation_cache (original_text, translated_text, source_language, target_language)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(text, translatedText, sourceLang, targetLang);
  }
}
