import db from './database.js';
import type { Config } from 'shared';

export class ConfigModel {
  static get(key: string): string | null {
    const stmt = db.prepare('SELECT value FROM config WHERE key = ?');
    const result = stmt.get(key) as Config | undefined;
    return result?.value || null;
  }

  static set(key: string, value: string): void {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO config (key, value)
      VALUES (?, ?)
    `);
    stmt.run(key, value);
  }

  static delete(key: string): void {
    const stmt = db.prepare('DELETE FROM config WHERE key = ?');
    stmt.run(key);
  }

  static getAll(): Record<string, string> {
    const stmt = db.prepare('SELECT key, value FROM config');
    const configs = stmt.all() as Config[];

    return configs.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  }
}
