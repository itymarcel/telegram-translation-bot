import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../../data/database.sqlite');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
export const db: Database.Database = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create tables
const initDb = () => {
  // Chats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      contact_name TEXT NOT NULL,
      contact_number TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      word_of_hour_enabled INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_message_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Translations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT NOT NULL,
      original_text TEXT NOT NULL,
      translated_text TEXT NOT NULL,
      source_language TEXT NOT NULL,
      target_language TEXT NOT NULL,
      direction TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id)
    )
  `);

  // Words of hour table
  db.exec(`
    CREATE TABLE IF NOT EXISTS words_of_hour (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id TEXT NOT NULL,
      word TEXT NOT NULL,
      translation TEXT NOT NULL,
      context TEXT NOT NULL,
      pronunciation TEXT NOT NULL,
      scheduled_for TEXT NOT NULL,
      delivered INTEGER DEFAULT 0,
      delivered_at TEXT,
      FOREIGN KEY (chat_id) REFERENCES chats(id)
    )
  `);

  // Config table
  db.exec(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Translation cache table
  db.exec(`
    CREATE TABLE IF NOT EXISTS translation_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_text TEXT NOT NULL,
      translated_text TEXT NOT NULL,
      source_language TEXT NOT NULL,
      target_language TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(original_text, source_language, target_language)
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_translations_chat_id ON translations(chat_id);
    CREATE INDEX IF NOT EXISTS idx_translations_timestamp ON translations(timestamp);
    CREATE INDEX IF NOT EXISTS idx_words_chat_id ON words_of_hour(chat_id);
    CREATE INDEX IF NOT EXISTS idx_words_scheduled ON words_of_hour(scheduled_for);
    CREATE INDEX IF NOT EXISTS idx_words_delivered ON words_of_hour(delivered);
    CREATE INDEX IF NOT EXISTS idx_cache_lookup ON translation_cache(original_text, source_language, target_language);
  `);

  console.log('Database initialized successfully');
};

initDb();

export default db;
