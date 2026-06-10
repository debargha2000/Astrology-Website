import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import helmet from 'helmet';

import { isFirebaseActive } from './db.js';
import { createCsrfProtection } from './middleware/csrf.js';
import { logger } from './middleware/logging.js';
import {
  initRedisRateLimiter,
  authRateLimiter,
  apiRateLimiter,
  paymentRateLimiter,
  aiRateLimiter,
} from './middleware/redisRateLimit.js';
import { requestId, requestLogger } from './middleware/requestId.js';
import aiRoutes from './routes/ai.routes.js';
import astroRoutes from './routes/astro.routes.js';
import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import openapiRoutes from './routes/openapi.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import productRoutes from './routes/product.routes.js';
import systemRoutes from './routes/system.routes.js';
import taskRoutes from './routes/task.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import websiteRoutes from './routes/website.routes.js';

const app = express();

// ==========================================
// CORS (must be before other middleware)
// ==========================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  process.env.APP_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  })
);

// ==========================================
// SECURITY HEADERS (apply to every response)
// ==========================================
const isDev = process.env.NODE_ENV !== 'production';
app.use(
  helmet({
    contentSecurityPolicy: isDev
      ? false
      : {
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
// REQUEST ID & LOGGING
// ==========================================
app.use(requestId);
app.use(requestLogger);

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
function getCookieSecret(): string {
  const cookieSecret = process.env.COOKIE_SECRET || process.env.JWT_SECRET;
  if (!cookieSecret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'FATAL: COOKIE_SECRET or JWT_SECRET must be set in production. Refusing to start with a default cookie secret.'
      );
    }
    logger.warn(
      '⚠️  COOKIE_SECRET/JWT_SECRET not set. Falling back to insecure development cookie secret.'
    );
    return 'aurastone-dev-cookie-secret-change-in-production-please';
  }
  return cookieSecret;
}

// CSRF exempt paths (defined before use)
const CSRF_EXEMPT_PATHS = new Set<string>(['/api/payments/razorpay/webhook']);

let cookieParserInstance: RequestHandler | null = null;
let csrfProtectionInstance: RequestHandler | null = null;

// Middleware to ensure cookie parser and CSRF are initialized and executed for the current request
app.use((req, res, next) => {
  try {
    if (!cookieParserInstance) {
      cookieParserInstance = cookieParser(getCookieSecret());
    }
    if (!csrfProtectionInstance) {
      csrfProtectionInstance = createCsrfProtection({
        cookieSecret: getCookieSecret(),
        exemptPaths: CSRF_EXEMPT_PATHS,
      });
    }

    cookieParserInstance(req, res, (err) => {
      if (err) return next(err);
      csrfProtectionInstance!(req, res, next);
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// REDIS RATE LIMITER INITIALIZATION
// ==========================================
initRedisRateLimiter();

// ==========================================
// DATABASE INITIALIZATION LOGGING
// ==========================================
if (isFirebaseActive()) {
  logger.info('SYSTEM INITIALIZATION: Connect successfully to Firebase Firestore Instance.');
} else {
  logger.warn(
    'SYSTEM INITIALIZATION: No Active Firebase configuration. Running with active JSON flat-file clusters.'
  );
}

// ==========================================
// API ROUTES
// ==========================================

// System & Auth
app.use('/api', apiRateLimiter, systemRoutes);
app.use('/api/auth', authRateLimiter, authRoutes);

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
app.use('/api/payments', paymentRateLimiter, paymentRoutes);

// AI Services
app.use('/api/ai', aiRateLimiter, aiRoutes);

// OpenAPI Documentation
app.use('/api/docs', openapiRoutes);

// ==========================================
// JSON ERROR HANDLER
// Converts CSRF and other middleware errors
// into structured JSON responses instead of
// Express's default HTML error page.
// ==========================================
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const code = (err as { code?: string })?.code;
  if (code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'CSRF validation failed.' });
  }
  const message = err instanceof Error ? err.message : 'Unknown server error';
  // Avoid leaking internals in 500 responses
  if (message.toLowerCase().includes('csrf')) {
    return res.status(403).json({ error: 'CSRF validation failed.' });
  }
  logger.error({ err }, 'Unhandled server error');
  if (message.startsWith('FATAL:')) {
    return res.status(500).json({ error: message });
  }
  return res.status(500).json({ error: 'Internal server error.' });
});

export default app;
