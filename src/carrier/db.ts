import Database from "better-sqlite3";
import path from "path";
import { logger } from "@logger";

const DB_PATH = path.join(process.cwd(), "carrier.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema();
    logger.info("Carrier database initialized", { path: DB_PATH });
  }
  return db;
}

function initSchema(): void {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS sync (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Discord side
      discord_thread_id TEXT NOT NULL UNIQUE,
      discord_channel_id TEXT NOT NULL,
      discord_guild_id TEXT NOT NULL,

      -- GitHub side
      github_issue_number INTEGER NOT NULL,
      github_repo TEXT NOT NULL,
      github_issue_url TEXT NOT NULL,

      -- Metadata
      title TEXT NOT NULL,
      issue_type TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      closed_at INTEGER,

      -- Composite unique constraint
      UNIQUE(github_repo, github_issue_number)
    );

    CREATE INDEX IF NOT EXISTS idx_github ON sync(github_repo, github_issue_number);
    CREATE INDEX IF NOT EXISTS idx_discord ON sync(discord_thread_id);
  `);
}

// Types
export interface SyncRecord {
  id: number;
  discord_thread_id: string;
  discord_channel_id: string;
  discord_guild_id: string;
  github_issue_number: number;
  github_repo: string;
  github_issue_url: string;
  title: string;
  issue_type: "bug" | "feature";
  created_by: string;
  created_at: number;
  closed_at: number | null;
}

// Queries
export function createSync(data: Omit<SyncRecord, "id" | "closed_at">): SyncRecord {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO sync (
      discord_thread_id, discord_channel_id, discord_guild_id,
      github_issue_number, github_repo, github_issue_url,
      title, issue_type, created_by, created_at
    ) VALUES (
      @discord_thread_id, @discord_channel_id, @discord_guild_id,
      @github_issue_number, @github_repo, @github_issue_url,
      @title, @issue_type, @created_by, @created_at
    )
  `);

  const result = stmt.run(data);
  return { ...data, id: result.lastInsertRowid as number, closed_at: null };
}

export function getSyncByDiscordThread(threadId: string): SyncRecord | undefined {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM sync WHERE discord_thread_id = ?");
  return stmt.get(threadId) as SyncRecord | undefined;
}

export function getSyncByGithubIssue(repo: string, issueNumber: number): SyncRecord | undefined {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM sync WHERE github_repo = ? AND github_issue_number = ?"
  );
  return stmt.get(repo, issueNumber) as SyncRecord | undefined;
}

export function markSyncClosed(id: number): void {
  const db = getDb();
  const stmt = db.prepare("UPDATE sync SET closed_at = ? WHERE id = ?");
  stmt.run(Date.now(), id);
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
