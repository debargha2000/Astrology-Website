import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import app from './server/app.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const IS_VERCEL = !!process.env.VERCEL;

if (IS_VERCEL) {
  // Vercel: serve built frontend from dist/
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Local / App Hosting: full dev or production server
  async function startServer() {
    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, HOST, () => {
      console.log(`✓ Spiritual operations backend online at: http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV || 'unset'})`);
    });
  }

  startServer().catch((err) => {
    console.error('Failed to start backend:', err);
    process.exit(1);
  });
}

export default app;
