
import Database from 'better-sqlite3';
const db = new Database('lexph.db');
const result = db.prepare("PRAGMA integrity_check").get();
console.log("Integrity Check:", result);
