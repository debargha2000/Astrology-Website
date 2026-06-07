import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import net from 'net';
import app from './server/app.js';
import { shutdownRedisRateLimiter } from './server/middleware/redisRateLimit.js';

const IS_VERCEL = !!process.env.VERCEL;

function isPortFree(port: number, host: string): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => tester.close(() => resolve(true)))
      .listen(port, host);
  });
}

async function findFreePort(start: number, host: string, maxTries = 50): Promise<number> {
  for (let p = start; p < start + maxTries; p++) {
    if (await isPortFree(p, host)) return p;
  }
  throw new Error(`No free port found in range ${start}–${start + maxTries - 1}`);
}

if (IS_VERCEL) {
  // Vercel: serve built frontend from dist/ (Vercel assigns the port)
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  } else {
    // Local / App Hosting: full dev or production server
    async function startServer() {
      const PREFERRED_PORT = Number(process.env.PORT) || 3000;
      const HOST = process.env.HOST || 'localhost';
      // Probe against the same host so we catch any binding (IPv4 or IPv6) on the port.
      const PORT = await findFreePort(PREFERRED_PORT, HOST);

    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
          host: HOST,
          port: PORT,
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      // Production local: serve built dist/
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, HOST, () => {
      const fellBack = PORT !== PREFERRED_PORT;
      console.log(`✓ Spiritual operations backend online at: http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV || 'unset'})`);
      if (fellBack) {
        console.log(`  ↳ preferred port ${PREFERRED_PORT} was busy — using ${PORT} instead`);
      }
    });
  }

  startServer().catch((err) => {
    console.error('Failed to start backend:', err);
    process.exit(1);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await shutdownRedisRateLimiter();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await shutdownRedisRateLimiter();
    process.exit(0);
  });
}

export default app;