# Azhari Academy Tutors

Deployment-ready Node.js starter for `tutors.azhariacademy.com`.

## Local development

Requirements: Node.js 20 or 22.

```bash
npm start
```

Open `http://localhost:3000`. The health check is available at
`http://localhost:3000/healthz`.

## cPanel AI App Hosting

- Runtime: Node.js 20 or 22
- Package manager: npm
- Start command: `npm start`
- Run mode: Production
- Environment: `NODE_ENV=production`
- Do not define `PORT`; cPanel provides it automatically.

The application binds to `0.0.0.0` and reads `process.env.PORT`, which are
required for the cPanel-managed container.
