import { describe, it, expect, beforeEach } from 'vitest';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { createCsrfProtection } from './csrf';

const COOKIE_SECRET = 'test-cookie-secret-please-change';

function buildApp(exemptPaths = new Set<string>()) {
  const app = express();
  app.use(cookieParser(COOKIE_SECRET));
  app.use(createCsrfProtection({ cookieSecret: COOKIE_SECRET, exemptPaths }));

  app.get('/api/csrf-token', (req: Request, res: Response) => {
    res.json({ csrfToken: req.csrfToken!() });
  });

  app.post('/api/echo', (req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post('/api/webhook', (req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.toLowerCase().includes('csrf')) {
      return res.status(403).json({ error: 'CSRF validation failed.' });
    }
    return res.status(500).json({ error: message });
  });

  return app;
}

describe('csrf middleware', () => {
  let app: express.Express;
  beforeEach(() => {
    app = buildApp(new Set(['/api/webhook']));
  });

  it('issues a CSRF token on GET', async () => {
    const res = await request(app).get('/api/csrf-token');
    expect(res.status).toBe(200);
    expect(res.body.csrfToken).toBeTruthy();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('allows POST with matching token and cookie', async () => {
    const getRes = await request(app).get('/api/csrf-token');
    const token = getRes.body.csrfToken as string;
    const cookie = (getRes.headers['set-cookie'] as string[]).find((c) => c.startsWith('_csrf='))!.split(';')[0];

    const res = await request(app)
      .post('/api/echo')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', token)
      .send({});

    expect(res.status).toBe(200);
  });

  it('rejects POST with missing token', async () => {
    const getRes = await request(app).get('/api/csrf-token');
    const cookie = (getRes.headers['set-cookie'] as string[]).find((c) => c.startsWith('_csrf='))!.split(';')[0];

    const res = await request(app).post('/api/echo').set('Cookie', cookie).send({});
    expect(res.status).toBe(403);
  });

  it('rejects POST with mismatched token', async () => {
    const getRes = await request(app).get('/api/csrf-token');
    const cookie = (getRes.headers['set-cookie'] as string[]).find((c) => c.startsWith('_csrf='))!.split(';')[0];

    const res = await request(app)
      .post('/api/echo')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', 'invalid-token')
      .send({});

    expect(res.status).toBe(403);
  });

  it('exempts configured paths from CSRF checks', async () => {
    const res = await request(app).post('/api/webhook').send({});
    expect(res.status).toBe(200);
  });
});
