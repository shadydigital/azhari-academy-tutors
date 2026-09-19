# Azhari Academy Tutors

Bilingual teacher recruitment portal and applicant tracking system for `tutors.azhariacademy.com`.

The approved product scope is documented in [PROJECT_BRIEF.md](./PROJECT_BRIEF.md).

## Local development

Requirements: Node.js 22 and MySQL/MariaDB.

```bash
npm install
cp .env.example .env
npm run db:setup
npm run admin:create -- admin@example.com "Admin Name"
npm run dev
```

Open `http://localhost:3000`. The health check is available at `http://localhost:3000/healthz`.

The local database helper uses the MariaDB installation included with XAMPP and stores test data under the ignored `.local/` directory. Use `npm run db:start`, `npm run db:status`, and `npm run db:stop` to manage it.

## Validation

```bash
npm run check
npm run build
npm start
```

## cPanel AI App Hosting

- Runtime: Node.js 22
- Package manager: npm
- Build command: `npm run build`
- Start command: `npm start`
- Run mode: Production
- Environment: `NODE_ENV=production`
- Do not define `PORT`; cPanel provides it automatically.

The application binds to `0.0.0.0` and reads `process.env.PORT`, which are required for the cPanel-managed container. Production also requires the database, token, mail, and storage environment variables described in `.env.example`.
