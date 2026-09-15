import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const isProduction = process.env.NODE_ENV === 'production';
const DB_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'shancode.db');

let sqlDb = null;
let pgPool = null;
let supabaseClient = null;

// Initialize Supabase Admin Client for privileged operations
export function getSupabase() {
  if (supabaseClient) return supabaseClient;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && serviceRoleKey && !supabaseUrl.includes('your-project-id')) {
    supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    return supabaseClient;
  }
  return null;
}

export async function getDb() {
  // If Supabase PostgreSQL URL is provided, connect via connection pool
  if (DB_URL && !DB_URL.includes('your-project')) {
    if (!pgPool) {
      pgPool = new pg.Pool({
        connectionString: DB_URL,
        ssl: process.env.PG_SSL === 'false' ? false : { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      });
    }
    return { type: 'pg', pool: pgPool };
  }

  // Graceful Local SQLite fallback for offline development
  if (sqlDb) return { type: 'sqlite', db: sqlDb, save: saveSqlite };

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();
  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    sqlDb = new SQL.Database(fileBuffer);
  } else {
    sqlDb = new SQL.Database();
  }

  try {
    sqlDb.exec("PRAGMA foreign_keys = ON;");
  } catch (e) {
    console.warn("Could not enable PRAGMA foreign_keys:", e.message);
  }

  return { type: 'sqlite', db: sqlDb, save: saveSqlite };
}

export function saveSqlite() {
  if (sqlDb) {
    const data = sqlDb.export();
    const buffer = Buffer.from(data);
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, buffer);
  }
}

// Convert SQLite '?' placeholders to PostgreSQL '$1', '$2', etc.
function toPgSql(sql) {
  let pIdx = 1;
  return sql.replace(/\?/g, () => `$${pIdx++}`);
}

// Unified query helper for Supabase PostgreSQL & SQLite
export async function query(sql, params = []) {
  const dbObj = await getDb();
  if (dbObj.type === 'pg') {
    const pgSql = toPgSql(sql);
    const res = await dbObj.pool.query(pgSql, params);
    return res.rows;
  } else {
    const stmt = dbObj.db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }
}

export async function run(sql, params = []) {
  const dbObj = await getDb();
  if (dbObj.type === 'pg') {
    let pgSql = toPgSql(sql);
    if (/^\s*INSERT\s+INTO/i.test(pgSql) && !/RETURNING/i.test(pgSql)) {
      pgSql += ' RETURNING id';
    }
    const res = await dbObj.pool.query(pgSql, params);
    return { 
      changes: res.rowCount, 
      lastInsertRowid: res.rows[0]?.id || 0 
    };
  } else {
    dbObj.db.run(sql, params);
    saveSqlite();
    const res = dbObj.db.exec("SELECT last_insert_rowid() as id;");
    const lastId = res[0]?.values[0]?.[0] || 0;
    return { changes: 1, lastInsertRowid: lastId };
  }
}

export async function exec(sql) {
  const dbObj = await getDb();
  if (dbObj.type === 'pg') {
    await dbObj.pool.query(sql);
  } else {
    dbObj.db.exec(sql);
    saveSqlite();
  }
}

export async function withTransaction(callback) {
  const dbObj = await getDb();
  if (dbObj.type === 'pg') {
    const client = await dbObj.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback({
        query: (sql, params) => client.query(toPgSql(sql), params).then(r => r.rows),
        run: async (sql, params) => {
          let pgSql = toPgSql(sql);
          if (/^\s*INSERT\s+INTO/i.test(pgSql) && !/RETURNING/i.test(pgSql)) pgSql += ' RETURNING id';
          const r = await client.query(pgSql, params);
          return { changes: r.rowCount, lastInsertRowid: r.rows[0]?.id || 0 };
        }
      });
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } else {
    try {
      dbObj.db.exec('BEGIN TRANSACTION;');
      const result = await callback({
        query: (sql, params) => query(sql, params),
        run: (sql, params) => run(sql, params)
      });
      dbObj.db.exec('COMMIT;');
      saveSqlite();
      return result;
    } catch (err) {
      try { dbObj.db.exec('ROLLBACK;'); } catch (e) {}
      throw err;
    }
  }
}
