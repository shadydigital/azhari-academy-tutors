import { execFile, spawn } from "node:child_process";
import { access, mkdir, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = process.cwd();
const xampp = "/Applications/XAMPP/xamppfiles";
const mysql = path.join(xampp, "bin/mysql");
const mysqlAdmin = path.join(xampp, "bin/mysqladmin");
const installer = path.join(xampp, "bin/mariadb-install-db");
const server = path.join(xampp, "sbin/mysqld");
const local = path.join(root, ".local");
const data = path.join(local, "mysql");
const run = path.join(local, "run");
const logs = path.join(local, "logs");
const socket = path.join(run, "mysql.sock");
const pidFile = path.join(run, "mysql.pid");
const logFile = path.join(logs, "mysql.log");
const schema = path.join(root, "db/schema.sql");
const command = process.argv[2] || "status";

async function exists(file) {
  try { await access(file, constants.F_OK); return true; } catch { return false; }
}

async function isRunning() {
  try {
    await exec(mysqlAdmin, ["--no-defaults", `--socket=${socket}`, "--user=root", "ping"]);
    return true;
  } catch { return false; }
}

async function initialize() {
  await mkdir(data, { recursive: true });
  await mkdir(run, { recursive: true });
  await mkdir(logs, { recursive: true });
  if (await exists(path.join(data, "mysql"))) return;
  console.log("Initializing the local MariaDB data directory…");
  await exec(installer, ["--no-defaults", `--basedir=${xampp}`, `--datadir=${data}`, "--auth-root-authentication-method=normal", "--skip-test-db"]);
}

async function start() {
  await initialize();
  if (await isRunning()) { console.log("Local database is already running on its private socket."); return; }
  const child = spawn(server, [
    "--no-defaults", `--basedir=${xampp}`, `--datadir=${data}`, "--port=3307", "--bind-address=127.0.0.1",
    `--socket=${socket}`, `--pid-file=${pidFile}`, `--log-error=${logFile}`, "--skip-name-resolve"
  ], { detached: true, stdio: "ignore" });
  child.unref();
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (await isRunning()) { console.log("Local database is running."); return; }
  }
  throw new Error(`MariaDB did not start. Check ${logFile}`);
}

async function stop() {
  if (!(await isRunning())) { console.log("Local database is already stopped."); return; }
  await exec(mysqlAdmin, ["--no-defaults", `--socket=${socket}`, "--user=root", "shutdown"]);
  console.log("Local database stopped.");
}

async function setup() {
  await start();
  await exec(mysql, ["--no-defaults", `--socket=${socket}`, "--user=root", "--execute=CREATE DATABASE IF NOT EXISTS azhari_tutors CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"]);
  await exec(mysql, ["--no-defaults", `--socket=${socket}`, "--user=root", "azhari_tutors", `--execute=source ${schema}`]);
  console.log("Local database schema is ready.");
}

if (command === "start") await start();
else if (command === "stop") await stop();
else if (command === "setup") await setup();
else if (command === "status") console.log((await isRunning()) ? "Local database is running." : "Local database is stopped.");
else throw new Error(`Unknown command: ${command}`);
