/**
 * Local development server: static files + POST /api/chat
 * Run: node server.mjs
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import handler from "./api/chat.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/chat") {
    await handler(req, res);
    return;
  }

  let relative = decodeURIComponent(url.pathname);
  if (relative === "/") relative = "/index.html";
  const filePath = path.join(__dirname, relative);

  if (!filePath.startsWith(__dirname)) {
    send(res, 403, "Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) {
      send(res, 404, "Not found");
      return;
    }
    const body = await readFile(filePath);
    const type = MIME[path.extname(filePath)] || "application/octet-stream";
    send(res, 200, body, { "Content-Type": type });
  } catch {
    send(res, 404, "Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
  console.log(`Chatbot provider: ${process.env.AI_PROVIDER || "local"}`);
});
