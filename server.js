"use strict";

const { createServer } = require("node:http");
const next = require("next");

const development = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: development, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

      if (request.method === "GET" && url.pathname === "/healthz") {
        response.writeHead(200, {
          "Cache-Control": "no-store",
          "Content-Type": "application/json; charset=utf-8"
        });
        response.end(JSON.stringify({
          service: "azhari-academy-tutors",
          status: "ok",
          environment: process.env.NODE_ENV || "development"
        }));
        return;
      }

      await handle(request, response);
    } catch (error) {
      console.error("Unhandled request error", error);
      response.statusCode = 500;
      response.end("Internal server error");
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Azhari Academy Tutors is running on http://${hostname}:${port}`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down.`);
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}).catch((error) => {
  console.error("Unable to start Azhari Academy Tutors", error);
  process.exit(1);
});
