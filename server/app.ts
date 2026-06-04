import cookieParser from 'cookie-parser';
import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import admin from 'firebase-admin';
import helmet from 'helmet';

import { getAdminEmail } from './config.js';
import { DB, isFirebaseActive } from './db.js';
import { createCsrfProtection } from './middleware/csrf.js';

// Modular Routers
import astroRoutes from './routes/astro.routes.js';
import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import productRoutes from './routes/product.routes.js';
import systemRoutes from './routes/system.routes.js';
import taskRoutes from './routes/task.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import websiteRoutes from './routes/website.routes.js';

const app = express();

// ==========================================
// SECURITY HEADERS (apply to every response)
// ==========================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://checkout.razorpay.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.razorpay.com', 'https://*.googleapis.com'],
        frameSrc: ["'self'", 'https://checkout.razorpay.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-site' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// ==========================================
// TRUST PROXY
// Required when running behind Vercel / Firebase App Hosting so
// `req.ip` reflects the real client (used by rate limiters) and
// `req.secure` correctly detects HTTPS for cookie flags.
// ==========================================
app.set('trust proxy', 1);

// ==========================================
// BODY PARSERS
// ==========================================
app.use(
  express.json({
    limit: '100kb',
    verify: (req: Request, _res: Response, buf: Buffer) => {
      (req as Request & { rawBody?: Buffer }).rawBody = buf;
    },
  })
);

// ==========================================
// COOKIE PARSER (required for csurf cookie mode)
// ==========================================
const cookieSecret = process.env.COOKIE_SECRET || process.env.JWT_SECRET;
if (!cookieSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'COOKIE_SECRET or JWT_SECRET must be set in production. Refusing to start with a default cookie secret.'
    );
  }
  console.warn(
    '⚠️  COOKIE_SECRET/JWT_SECRET not set. Falling back to insecure development cookie secret.'
  );
}
const finalCookieSecret = cookieSecret || 'aurastone-dev-cookie-secret-change-in-production-please';
app.use(cookieParser(finalCookieSecret));

// ==========================================
// CSRF PROTECTION
// Skips the Razorpay webhook (the webhook is
// called by an external service and is verified
// via HMAC signature instead). Safe methods
// (GET/HEAD/OPTIONS) are ignored by the middleware itself.
// ==========================================
const CSRF_EXEMPT_PATHS = new Set<string>(['/api/payments/razorpay/webhook']);

const csrfProtection = createCsrfProtection({
  cookieSecret: finalCookieSecret,
  exemptPaths: CSRF_EXEMPT_PATHS,
});
app.use(csrfProtection);

// ==========================================
// DATABASE INITIALIZATION LOGGING
// ==========================================
if (isFirebaseActive()) {
  DB.addLog('SYSTEM INITIALIZATION: Connect successfully to Firebase Firestore Instance.');
} else {
  DB.addLog(
    'SYSTEM INITIALIZATION: No Active Firebase configuration. Running with active JSON flat-file clusters.'
  );
}

// ==========================================
// API ROUTES
// ==========================================

// System & Auth
app.use('/api', systemRoutes);
app.use('/api/auth', authRoutes);

// Business Domains
app.use('/api/invoices', invoiceRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/tasks', taskRoutes);

// Astro & Content
app.use('/api/astro-content', astroRoutes);
app.use('/api/products', productRoutes);
app.use('/api/website', websiteRoutes);

// Payments
app.use('/api/payments', paymentRoutes);

// ==========================================
// JSON ERROR HANDLER
// Converts CSRF and other middleware errors
// into structured JSON responses instead of
// Express's default HTML error page.
// ==========================================
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const code = (err as any)?.code;
  if (code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'CSRF validation failed.' });
  }
  const message = err instanceof Error ? err.message : 'Unknown server error';
  // Avoid leaking internals in 500 responses
  if (message.toLowerCase().includes('csrf')) {
    return res.status(403).json({ error: 'CSRF validation failed.' });
  }
  console.error('Unhandled server error:', err);
  return res.status(500).json({ error: 'Internal server error.' });
});

export default app;
