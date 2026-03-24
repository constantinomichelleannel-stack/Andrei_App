
import Database from 'better-sqlite3';
const db = new Database('lexph.db');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables:", tables);

for (const table of tables as any[]) {
  const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get() as { count: number };
  console.log(`Table ${table.name} has ${count.count} rows.`);
}
