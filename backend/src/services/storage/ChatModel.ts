import db from './database.js';
import type { Chat } from 'shared';

export class ChatModel {
  static getAll(): Chat[] {
    const stmt = db.prepare(`
      SELECT * FROM chats
      WHERE is_active = 1
      ORDER BY last_message_at DESC
    `);
    return stmt.all() as Chat[];
  }

  static getById(id: string): Chat | undefined {
    const stmt = db.prepare('SELECT * FROM chats WHERE id = ?');
    return stmt.get(id) as Chat | undefined;
  }

  static create(chat: Omit<Chat, 'created_at' | 'last_message_at'>): Chat {
    const stmt = db.prepare(`
      INSERT INTO chats (id, contact_name, contact_number, is_active, word_of_hour_enabled)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      chat.id,
      chat.contact_name,
      chat.contact_number,
      chat.is_active ? 1 : 0,
      chat.word_of_hour_enabled ? 1 : 0
    );

    return this.getById(chat.id)!;
  }

  static upsert(chat: Omit<Chat, 'created_at' | 'last_message_at'>): Chat {
    const existing = this.getById(chat.id);

    if (existing) {
      this.updateLastMessageTime(chat.id);
      return this.getById(chat.id)!;
    }

    return this.create(chat);
  }

  static updateLastMessageTime(id: string): void {
    const stmt = db.prepare(`
      UPDATE chats
      SET last_message_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(id);
  }

  static updateSettings(id: string, settings: Partial<Pick<Chat, 'word_of_hour_enabled' | 'is_active'>>): void {
    const updates: string[] = [];
    const values: any[] = [];

    if (settings.word_of_hour_enabled !== undefined) {
      updates.push('word_of_hour_enabled = ?');
      values.push(settings.word_of_hour_enabled ? 1 : 0);
    }

    if (settings.is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(settings.is_active ? 1 : 0);
    }

    if (updates.length === 0) return;

    values.push(id);
    const stmt = db.prepare(`UPDATE chats SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
  }

  static getActiveChatsWithWordOfHour(): Chat[] {
    const stmt = db.prepare(`
      SELECT * FROM chats
      WHERE is_active = 1 AND word_of_hour_enabled = 1
      ORDER BY last_message_at DESC
    `);
    return stmt.all() as Chat[];
  }
}
