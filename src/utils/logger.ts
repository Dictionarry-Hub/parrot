import fs from "fs";
import path from "path";

const colors = {
  grey: "\x1b[90m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  reset: "\x1b[0m",
};

type LogLevel = "debug" | "info" | "warn" | "error";

const levelColors: Record<LogLevel, string> = {
  debug: colors.grey,
  info: colors.blue,
  warn: colors.yellow,
  error: colors.red,
};

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

function getLogFile(): string {
  const date = new Date().toISOString().split("T")[0];
  return path.join(logsDir, `${date}.log`);
}

function formatTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-US", { hour12: false });
}

function formatTimestampWithMs(): string {
  const now = new Date();
  return now.toISOString();
}

function log(level: LogLevel, message: string, metadata?: object): void {
  const timestamp = formatTimestamp();
  const meta = metadata ? ` ${JSON.stringify(metadata)}` : "";

  // Console output (with colors)
  const consoleTimestamp = `${colors.grey}${timestamp}${colors.reset}`;
  const consoleLevelStr = `${levelColors[level]}${level.toUpperCase().padEnd(5)}${colors.reset}`;
  const consoleMeta = metadata
    ? ` ${colors.grey}${JSON.stringify(metadata)}${colors.reset}`
    : "";
  console.log(`${consoleTimestamp} | ${consoleLevelStr} | ${message}${consoleMeta}`);

  // File output (no colors, with full timestamp)
  const fileLine = `${formatTimestampWithMs()} | ${level.toUpperCase().padEnd(5)} | ${message}${meta}\n`;
  fs.appendFileSync(getLogFile(), fileLine);
}

export const logger = {
  debug: (message: string, metadata?: object) => log("debug", message, metadata),
  info: (message: string, metadata?: object) => log("info", message, metadata),
  warn: (message: string, metadata?: object) => log("warn", message, metadata),
  error: (message: string, metadata?: object) => log("error", message, metadata),
};
