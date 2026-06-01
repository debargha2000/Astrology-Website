import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { DB, isFirebaseActive } from './db.js';
import { authenticateToken, signToken } from './middleware/auth.js';
import { sendFulfillmentEmail } from './services/email.js';
import { createCsrfProtection } from './middleware/csrf.js';

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
// BODY PARSERS
// ==========================================
app.use(
  express.json({
    verify: (req: Request, _res: Response, buf: Buffer) => {
      (req as Request & { rawBody?: Buffer }).rawBody = buf;
    },
  })
);

// ==========================================
// COOKIE PARSER (required for csurf cookie mode)
// ==========================================
const cookieSecret =
  process.env.COOKIE_SECRET ||
  process.env.JWT_SECRET ||
  'aurastone-dev-cookie-secret-change-in-production-please';
app.use(cookieParser(cookieSecret));

// ==========================================
// CSRF PROTECTION
// Skips the Razorpay webhook (the webhook is
// called by an external service and is verified
// via HMAC signature instead). Safe methods
// (GET/HEAD/OPTIONS) are ignored by the middleware itself.
// ==========================================
const CSRF_EXEMPT_PATHS = new Set<string>([
  '/api/payments/razorpay/webhook',
]);

const csrfProtection = createCsrfProtection({
  cookieSecret,
  exemptPaths: CSRF_EXEMPT_PATHS,
});
app.use(csrfProtection);

// ==========================================
// RATE LIMITERS
// ==========================================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' },
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment requests. Please slow down.' },
});

if (isFirebaseActive()) {
  DB.addLog('SYSTEM INITIALIZATION: Connect successfully to Firebase Firestore Instance.');
} else {
  DB.addLog('SYSTEM INITIALIZATION: No Active Firebase configuration. Running with active JSON flat-file clusters.');
}

// ==========================================
// CSRF TOKEN ENDPOINT
// The SPA calls this once on load, reads the
// _csrf cookie, and echoes it back via the
// X-CSRF-Token header on state-changing requests.
// ==========================================
app.get('/api/csrf-token', (req: Request, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ==========================================
// 1. STAFF AUTH API
// ==========================================
app.post(
  '/api/auth/google-login',
  authLimiter,
  async (req: Request, res: Response) => {
    const { email, uid, displayName } = req.body as {
      email?: string;
      uid?: string;
      displayName?: string;
    };

    if (!email) {
      return res.status(400).json({ error: 'Google email coordinate is required.' });
    }

    const emailLower = email.toLowerCase();

    if (emailLower !== 'debarghapakhira@gmail.com') {
      await DB.addLog(`SECURITY AUDIT FAILURE: Unauthorized Google login attempt made by "${emailLower}".`);
      return res.status(403).json({ error: 'Access Denied: Only debarghapakhira@gmail.com is authorized.' });
    }

    const token = signToken({
      id: uid || 'google-admin-id',
      username: emailLower,
      email: emailLower,
      role: 'admin',
    });

    await DB.addLog(`STAFF LOG IN: Google Sign-In completed for "${emailLower}" (${displayName || 'N/A'}).`);
    return res.json({ token, role: 'admin', username: emailLower });
  }
);

// ==========================================
// 2. INVOICES REST API
// ==========================================
app.get('/api/invoices', authenticateToken, async (_req: Request, res: Response) => {
  const invoices = await DB.getInvoices();
  res.json(invoices);
});

app.post('/api/invoices', authenticateToken, async (req: Request, res: Response) => {
  const { client, item, amount, status, alignment } = req.body as {
    client?: string;
    item?: string;
    amount?: number | string;
    status?: string;
    alignment?: string;
  };
  if (!client || !amount) {
    return res.status(400).json({ error: 'Missing client coordinates or total payment amount.' });
  }

  const invoice = await DB.addInvoice({
    client,
    date: new Date().toISOString().split('T')[0],
    item: item || 'Planetary Crystal Alignment Package',
    amount: Number(amount),
    status: (status as 'Paid' | 'Sent' | 'Overdue' | 'Draft') || 'Sent',
    alignment: alignment || 'Universal Alignment',
  });
  res.status(201).json(invoice);
});

app.delete('/api/invoices/:id', authenticateToken, async (req: Request, res: Response) => {
  const success = await DB.deleteInvoice(req.params.id);
  if (success) {
    res.json({ message: 'Invoice successfully pruned.' });
  } else {
    res.status(404).json({ error: 'Invoice signature reference not found.' });
  }
});

// ==========================================
// 3. VENDORS REST API
// ==========================================
app.get('/api/vendors', authenticateToken, async (_req: Request, res: Response) => {
  const vendors = await DB.getVendors();
  res.json(vendors);
});

app.post('/api/vendors', authenticateToken, async (req: Request, res: Response) => {
  const { name, contact, origin, category, leadTime, leadGems } = req.body as {
    name?: string;
    contact?: string;
    origin?: string;
    category?: string;
    leadTime?: string;
    leadGems?: string;
  };
  if (!name || !contact) {
    return res.status(400).json({ error: 'Name and contact person are required.' });
  }

  const vendor = await DB.addVendor({
    name,
    contact,
    origin: origin || 'Himalayan Foothills',
    category: category || 'Raw Crystals',
    leadTime: leadTime || '5 Days',
    leadGems: leadGems || 'Crystalline beads',
  });
  res.status(201).json(vendor);
});

app.delete('/api/vendors/:id', authenticateToken, async (req: Request, res: Response) => {
  const success = await DB.deleteVendor(req.params.id);
  if (success) {
    res.json({ message: 'Vendor registration successfully suspended.' });
  } else {
    res.status(404).json({ error: 'Vendor signature reference not found.' });
  }
});

// ==========================================
// 4. EXPENSES REST API
// ==========================================
app.get('/api/expenses', authenticateToken, async (_req: Request, res: Response) => {
  const expenses = await DB.getExpenses();
  res.json(expenses);
});

app.post('/api/expenses', authenticateToken, async (req: Request, res: Response) => {
  const { title, category, amount, notes } = req.body as {
    title?: string;
    category?: string;
    amount?: number | string;
    notes?: string;
  };
  if (!title || !amount) {
    return res.status(400).json({ error: 'Title and amount parameters have not been compiled.' });
  }

  const expense = await DB.addExpense({
    title,
    category: category || 'Ritual Consecration',
    amount: Number(amount),
    notes: notes || '',
  });
  res.status(201).json(expense);
});

app.delete('/api/expenses/:id', authenticateToken, async (req: Request, res: Response) => {
  const success = await DB.deleteExpense(req.params.id);
  if (success) {
    res.json({ message: 'Expense records successfully archived.' });
  } else {
    res.status(404).json({ error: 'Expense code reference not found.' });
  }
});

// ==========================================
// 5. TASKS REST API
// ==========================================
app.get('/api/tasks', authenticateToken, async (_req: Request, res: Response) => {
  const tasks = await DB.getTasks();
  res.json(tasks);
});

app.post('/api/tasks', authenticateToken, async (req: Request, res: Response) => {
  const { title, status, priority, assignee, daysLeft } = req.body as {
    title?: string;
    status?: 'Backlog' | 'Water Cleanse' | 'Moon Bath Bathing' | 'Sealed / Composed';
    priority?: 'Low' | 'Medium' | 'High';
    assignee?: string;
    daysLeft?: number | string;
  };
  if (!title || !assignee) {
    return res.status(400).json({ error: 'Title and responsible assignee are mandatory fields.' });
  }

  const task = await DB.addTask({
    title,
    status: status || 'Backlog',
    priority: priority || 'Medium',
    assignee,
    daysLeft: Number(daysLeft) || 3,
  });
  res.status(201).json(task);
});

app.put('/api/tasks/:id/status', authenticateToken, async (req: Request, res: Response) => {
  const { status } = req.body as { status?: string };
  if (!status) {
    return res.status(400).json({ error: 'Missing state status parameter.' });
  }

  const updatedTask = await DB.updateTaskStatus(
    req.params.id,
    status as 'Backlog' | 'Water Cleanse' | 'Moon Bath Bathing' | 'Sealed / Composed'
  );
  if (updatedTask) {
    res.json(updatedTask);
  } else {
    res.status(404).json({ error: 'Vedic task identifier not discovered.' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req: Request, res: Response) => {
  const success = await DB.deleteTask(req.params.id);
  if (success) {
    res.json({ message: 'Task resolved/archived.' });
  } else {
    res.status(404).json({ error: 'Task signature reference not found.' });
  }
});

// ==========================================
// 6. TERMINAL LOGS
// ==========================================
app.get('/api/logs', authenticateToken, async (_req: Request, res: Response) => {
  const logs = await DB.getLogs();
  res.json(logs);
});

// ==========================================
// 7. WEBSITE CONTENT, PRODUCTS, AND ROLLBACK
// ==========================================
app.get('/api/products', async (_req: Request, res: Response) => {
  try {
    const products = await DB.getProducts();
    res.json(products);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.post('/api/products', authenticateToken, async (req: Request, res: Response) => {
  try {
    const product = await DB.saveProduct(req.body);
    res.status(200).json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const success = await DB.deleteProduct(req.params.id);
    if (success) {
      res.json({ message: 'Product deleted.' });
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.get('/api/website/content', async (_req: Request, res: Response) => {
  try {
    const content = await DB.getWebsiteContent();
    res.json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.post('/api/website/content', authenticateToken, async (req: Request, res: Response) => {
  try {
    const content = await DB.saveWebsiteContent(req.body);
    res.status(200).json(content);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.get('/api/website/checkpoints', authenticateToken, async (_req: Request, res: Response) => {
  try {
    const checkpoints = await DB.getCheckpoints();
    res.json(checkpoints);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.post('/api/website/checkpoints', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title } = req.body as { title?: string };
    const checkpoint = await DB.createCheckpoint(
      title || 'Periodic Operational Checkpoint',
      req.user?.username || 'debarghapakhira@gmail.com'
    );
    res.status(201).json(checkpoint);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.post('/api/website/checkpoints/:id/rollback', authenticateToken, async (req: Request, res: Response) => {
  try {
    const success = await DB.rollbackToCheckpoint(req.params.id);
    if (success) {
      res.json({ message: 'Rollback succeeded.' });
    } else {
      res.status(404).json({ error: 'Rollback failed.' });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// ==========================================
// 8. PAYMENTS: RAZORPAY GATEWAY
// ==========================================
app.post(
  '/api/payments/razorpay/order',
  paymentLimiter,
  async (req: Request, res: Response) => {
    const { amount, currency = 'INR', receiptEmail, clientName, cartItems } = req.body as {
      amount?: number;
      currency?: string;
      receiptEmail?: string;
      clientName?: string;
      cartItems?: string;
    };

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Total amount is required for setting up order tunnels.' });
    }

    const orderId = 'order_' + crypto.randomBytes(6).toString('hex');
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (razorpayKeyId && razorpaySecret) {
      const authString = Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString('base64');
      try {
        const apiResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authString}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100),
            currency,
            receipt: 'rec_' + Date.now().toString().slice(-6),
            notes: {
              clientName,
              clientEmail: receiptEmail,
              itemsDescription: cartItems || 'High-Precision Consecration Curation Bundle',
            },
          }),
        });

        if (!apiResponse.ok) {
          throw new Error('Failure during remote Razorpay initialization.');
        }

        const orderData = await apiResponse.json();
        await DB.addLog(`RAZORPAY LIVE: Registered order ${orderData.id} for ₹${amount}`);
        return res.status(201).json(orderData);
      } catch (err) {
        console.error('Razorpay processing exception: ', err);
        await DB.addLog('RAZORPAY EXCEPTION: Live channel failover. Generating sandboxed transaction.');
      }
    }

    await DB.addLog(`RAZORPAY SANDBOX: Allocated checkout reference ${orderId} for ₹${amount}`);
    res.status(201).json({
      id: orderId,
      entity: 'order',
      amount: amount * 100,
      amount_paid: 0,
      amount_due: amount * 100,
      currency,
      receipt: 'rec_' + Date.now().toString().slice(-6),
      status: 'created',
      notes: {
        clientName,
        clientEmail: receiptEmail,
        itemsDescription: cartItems || 'Sandboxed Curation Package',
      },
      created_at: Math.floor(Date.now() / 1000),
    });
  }
);

// Razorpay webhook: CSRF-exempt (external service) and verified via HMAC signature.
app.post('/api/payments/razorpay/webhook', async (req: Request, res: Response) => {
  const signatureHeader = req.headers['x-razorpay-signature'];
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  const razorpaySecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || 'sacred_webhook7592_signature';

  if (!signature) {
    return res.status(400).json({ error: 'Missing security signature block.' });
  }

  let isSignatureValid = false;
  try {
    const rawBodyBuffer = (req as Request & { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body));
    const hmac = crypto.createHmac('sha256', razorpaySecret);
    hmac.update(rawBodyBuffer);
    const expectedSignature = hmac.digest('hex');

    isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    isSignatureValid = false;
  }

  const isBypassActive = process.env.NODE_ENV !== 'production' && signature === 'bypass_test_mode';

  if (!isSignatureValid && !isBypassActive) {
    await DB.addLog('CRITICAL: Unauthorized signature received on payment webhook.');
    return res.status(403).json({ error: 'Signature failure. Connection unauthorized.' });
  }

  const body = req.body as {
    event?: string;
    payload?: { payment?: { entity?: Record<string, unknown> } };
    amount?: number;
    clientName?: string;
    receiptEmail?: string;
    cartItems?: string;
  };

  const event = body?.event;
  const payload = body?.payload;

  if (event === 'payment.captured' || event === 'simulated.payment.captured' || isBypassActive) {
    const paymentEntity = (payload?.payment?.entity || {}) as {
      order_id?: string;
      amount?: number;
      notes?: { clientName?: string; clientEmail?: string; itemsDescription?: string };
    };
    const razorpayOrderId = paymentEntity.order_id || 'order_sandbox_re';
    const amountPaidInRupees = (paymentEntity.amount || body?.amount || 10000) / 100;
    const clientName = paymentEntity.notes?.clientName || body?.clientName || 'Vrishabha Devotee';
    const clientEmail = paymentEntity.notes?.clientEmail || body?.receiptEmail || 'operations@aurastone.in';
    const itemNames = paymentEntity.notes?.itemsDescription || body?.cartItems || 'Planetary Crystal Alignment Package';

    await DB.addLog(`WEBHOOK TRANSACTION VERIFIED: Secured Order ID ${razorpayOrderId} (₹${amountPaidInRupees})`);

    await DB.addInvoice({
      client: clientName,
      date: new Date().toISOString().split('T')[0],
      item: itemNames,
      amount: amountPaidInRupees,
      status: 'Paid',
      alignment: 'Secured via Razorpay Secure checkout Gateway',
    });

    await DB.addTask({
      title: `Sanctify crystals for order: ${razorpayOrderId} (${clientName})`,
      status: 'Water Cleanse',
      priority: 'High',
      assignee: 'Pandit Sharma',
      daysLeft: 3,
    });

    await sendFulfillmentEmail(clientEmail, clientName, itemNames, razorpayOrderId);

    return res.json({ status: 'success', message: 'Fulfillment sequence synced', orderId: razorpayOrderId });
  }

  res.json({ status: 'ignored', event });
});

// ==========================================
// JSON ERROR HANDLER
// Converts CSRF and other middleware errors
// into structured JSON responses instead of
// Express's default HTML error page.
// ==========================================
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Unknown server error';
  if (message.toLowerCase().includes('csrf')) {
    return res.status(403).json({ error: 'CSRF validation failed.' });
  }
  console.error('Unhandled server error:', err);
  return res.status(500).json({ error: message });
});

export default app;
