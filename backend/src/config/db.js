import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import pg from 'pg';

const isProduction = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL;
const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'shancode.db');

let sqlDb = null;
let pgPool = null;

export async function getDb() {
  if (isProduction) {
    if (!pgPool) {
      pgPool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
    }
    return { type: 'pg', pool: pgPool };
  }

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

// Unified query helper for SQLite & PostgreSQL
export async function query(sql, params = []) {
  const dbObj = await getDb();
  if (dbObj.type === 'pg') {
    // PostgreSQL uses $1, $2 instead of ?
    let pgSql = sql;
    let pIdx = 1;
    while (pgSql.includes('?')) {
      pgSql = pgSql.replace('?', `$${pIdx++}`);
    }
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
    let pgSql = sql;
    let pIdx = 1;
    while (pgSql.includes('?')) {
      pgSql = pgSql.replace('?', `$${pIdx++}`);
    }
    const res = await dbObj.pool.query(pgSql, params);
    return { changes: res.rowCount, lastInsertRowid: res.rows[0]?.id || 0 };
  } else {
    dbObj.db.run(sql, params);
    saveSqlite();
    // Fetch last inserted ID
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
