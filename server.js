"use strict";

const http = require("node:http");
const { createReadStream, statSync } = require("node:fs");
const { extname, join, normalize } = require("node:path");

const host = process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const publicDirectory = join(__dirname, "public");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function applySecurityHeaders(response) {
  response.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function resolvePublicFile(pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(requestedPath);
  } catch {
    return null;
  }

  const normalizedPath = normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = join(publicDirectory, normalizedPath);

  if (!filePath.startsWith(publicDirectory)) {
    return null;
  }

  return filePath;
}

const server = http.createServer((request, response) => {
  applySecurityHeaders(response);

  const requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && requestUrl.pathname === "/healthz") {
    return sendJson(response, 200, {
      service: "azhari-academy-tutors",
      status: "ok",
      environment: process.env.NODE_ENV || "development"
    });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return sendJson(response, 405, { error: "method_not_allowed" });
  }

  const filePath = resolvePublicFile(requestUrl.pathname);

  if (!filePath) {
    return sendJson(response, 400, { error: "invalid_path" });
  }

  try {
    const fileStat = statSync(filePath);

    if (!fileStat.isFile()) {
      throw new Error("Not a file");
    }

    response.writeHead(200, {
      "Cache-Control": extname(filePath) === ".html" ? "no-cache" : "public, max-age=3600",
      "Content-Length": fileStat.size,
      "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream"
    });

    if (request.method === "HEAD") {
      return response.end();
    }

    return createReadStream(filePath).pipe(response);
  } catch {
    return sendJson(response, 404, { error: "not_found" });
  }
});

server.listen(port, host, () => {
  console.log(`Azhari Academy Tutors is running on http://${host}:${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received; shutting down.`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
