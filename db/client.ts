import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const sqlite = openDatabaseSync('habit_tracker.db');

sqlite.execSync(`
PRAGMA foreign_keys = ON;


CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT NOT NULL,
password TEXT NOT NULL
);



CREATE TABLE IF NOT EXISTS categories (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
name TEXT NOT NULL,
colour_id INTEGER NOT NULL
);



CREATE TABLE IF NOT EXISTS habits (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
name TEXT NOT NULL,
metric_type TEXT NOT NULL,
icon_id INTEGER NOT NULL,
created_at TEXT NOT NULL
);


  
CREATE TABLE IF NOT EXISTS habit_logs (
id INTEGER PRIMARY KEY AUTOINCREMENT,
habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
logged_at TEXT NOT NULL,
value INTEGER NOT NULL
);



CREATE TABLE IF NOT EXISTS targets (
id INTEGER PRIMARY KEY AUTOINCREMENT,
habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
period TEXT NOT NULL,
amount INTEGER NOT NULL
);
`);


export const db = drizzle(sqlite);