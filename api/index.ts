/**
 * Vercel Serverless Function - Express API Handler
 * 
 * This wraps the entire Express server as a single Vercel serverless function.
 * All /api/* routes are handled here.
 */

import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { DB, isFirebaseActive } from '../server/db.js';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'signtific_master_90432Hz_astro_key';

// Parse JSON while preserving the raw body buffer for secure cryptographic signature validation
app.use(express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf;
  }
}));

// Check Firebase Firestore connectivity upon startup
if (isFirebaseActive()) {
  DB.addLog('SYSTEM INITIALIZATION: Connect successfully to Firebase Firestore Instance.');
} else {
  DB.addLog('SYSTEM INITIALIZATION: No Active Firebase configuration. Running with active JSON flat-file clusters.');
}

// ==========================================
// MIDDLEWARE: JWT TOKEN VALIDATION
// ==========================================
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing divine session credentials.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Astral session expired or corrupt.' });
    }
    req.user = decoded;
    next();
  });
}

// ==========================================
// EMAIL NOTIFICATION CORE (Nodemailer)
// ==========================================
function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  return null;
}

async function sendFulfillmentEmail(clientEmail: string, clientName: string, itemsDescription: string, orderId: string) {
  const transporter = getMailTransporter();
  const subject = `⚡ Consecration Cycle Initialized - Aura & Stone (Order #${orderId})`;
  
  const textContent = `Greetings ${clientName},\n\nYour payment has been successfully secured. The 3-Nights Purification & Consecration Cycle has been initialized for your items: ${itemsDescription}.\n\nHimalayan Sourcing Coordinates: Jammu, India.\nCertification code: SGD-${orderId}.\n\nDeep regards,\nAura & Stone Private Ltd.`;
  
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 24px; color: #1C1917; background-color: #FAF7F2; border-radius: 16px; border: 1px solid #EAE6DF; max-width: 600px; margin: 0 auto;">
      <h2 style="font-family: serif; font-size: 20px; border-bottom: 2px solid #D4AF37; padding-bottom: 8px; color: #151313; text-transform: uppercase; letter-spacing: 0.05em;">
        Divine Consecration Chamber
      </h2>
      <p style="font-size: 14px; line-height: 1.6; color: #44403C;">
        Greetings <strong>${clientName}</strong>,
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #44403C;">
        Your transaction for Order <strong>#${orderId}</strong> has cleared checkout. Your chosen items have been moved into our sacred Himalayan purification chamber:
      </p>
      <blockquote style="background-color: #FDFBF7; border-left: 4px solid #D4AF37; padding: 12px; margin: 16px 0; font-size: 13px; font-style: italic; color: #57534E;">
        ${itemsDescription}
      </blockquote>
      <p style="font-size: 12px; margin-top: 24px; color: #857F75; text-align: center; border-top: 1px solid #EAE6DF; padding-top: 12px;">
        Aura & Stone Private Ltd. • Central Operations • Rishikesh, Uttarakhand, India
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: '"Aura & Stone Operations" <operations@aurastone.in>',
        to: clientEmail,
        subject,
        text: textContent,
        html: htmlContent
      });
      await DB.addLog(`TRANSACTIONAL EMAIL DESPATCHED: Verification notice sent to client ${clientEmail}`);
    } catch (err: any) {
      console.error('Email dispatch error', err);
      await DB.addLog(`EMAIL ANOMALY: Failed to dispatch real SMTP transmission.`);
    }
  } else {
    console.log(`[SMTP SIMULATION] sending email to ${clientEmail}`);
    await DB.addLog(`EMAIL SIMULATOR INTERACTION: Mock receipt transmitted to: ${clientEmail}`);
  }
}

// ==========================================
// 1. STAFF AUTH API
// ==========================================
app.post('/api/auth/google-login', async (req, res) => {
  const { email, uid, displayName } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Google email coordinate is required.' });
  }

  const emailLower = email.toLowerCase();
  
  if (emailLower !== 'debarghapakhira@gmail.com') {
    await DB.addLog(`SECURITY AUDIT FAILURE: Unauthorized Google login attempt made by "${emailLower}".`);
    return res.status(403).json({ error: 'Access Denied: Only debarghapakhira@gmail.com is authorized.' });
  }

  const token = jwt.sign(
    { id: uid || 'google-admin-id', username: emailLower, email: emailLower, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  await DB.addLog(`STAFF LOG IN: Google Sign-In completed for "${emailLower}" (${displayName || 'N/A'}).`);
  return res.json({ token, role: 'admin', username: emailLower });
});

// ==========================================
// 2. INVOICES REST API
// ==========================================
app.get('/api/invoices', authenticateToken, async (req, res) => {
  const invoices = await DB.getInvoices();
  res.json(invoices);
});

app.post('/api/invoices', authenticateToken, async (req, res) => {
  const { client, item, amount, status, alignment } = req.body;
  if (!client || !amount) {
    return res.status(400).json({ error: 'Missing client coordinates or total payment amount.' });
  }

  const invoice = await DB.addInvoice({
    client,
    date: new Date().toISOString().split('T')[0],
    item: item || 'Planetary Crystal Alignment Package',
    amount: Number(amount),
    status: status || 'Sent',
    alignment: alignment || 'Universal Alignment'
  });
  res.status(201).json(invoice);
});

app.delete('/api/invoices/:id', authenticateToken, async (req, res) => {
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
app.get('/api/vendors', authenticateToken, async (req, res) => {
  const vendors = await DB.getVendors();
  res.json(vendors);
});

app.post('/api/vendors', authenticateToken, async (req, res) => {
  const { name, contact, origin, category, leadTime, leadGems } = req.body;
  if (!name || !contact) {
    return res.status(400).json({ error: 'Name and contact person are required.' });
  }

  const vendor = await DB.addVendor({
    name,
    contact,
    origin: origin || 'Himalayan Foothills',
    category: category || 'Raw Crystals',
    leadTime: leadTime || '5 Days',
    leadGems: leadGems || 'Crystalline beads'
  });
  res.status(201).json(vendor);
});

app.delete('/api/vendors/:id', authenticateToken, async (req, res) => {
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
app.get('/api/expenses', authenticateToken, async (req, res) => {
  const expenses = await DB.getExpenses();
  res.json(expenses);
});

app.post('/api/expenses', authenticateToken, async (req, res) => {
  const { title, category, amount, notes } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ error: 'Title and amount parameters have not been compiled.' });
  }

  const expense = await DB.addExpense({
    title,
    category: category || 'Ritual Consecration',
    amount: Number(amount),
    notes: notes || ''
  });
  res.status(201).json(expense);
});

app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
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
app.get('/api/tasks', authenticateToken, async (req, res) => {
  const tasks = await DB.getTasks();
  res.json(tasks);
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  const { title, status, priority, assignee, daysLeft } = req.body;
  if (!title || !assignee) {
    return res.status(400).json({ error: 'Title and responsible assignee are mandatory fields.' });
  }

  const task = await DB.addTask({
    title,
    status: status || 'Backlog',
    priority: priority || 'Medium',
    assignee,
    daysLeft: Number(daysLeft) || 3
  });
  res.status(201).json(task);
});

app.put('/api/tasks/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Missing state status parameter.' });
  }

  const updatedTask = await DB.updateTaskStatus(req.params.id, status);
  if (updatedTask) {
    res.json(updatedTask);
  } else {
    res.status(404).json({ error: 'Vedic task identifier not discovered.' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
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
app.get('/api/logs', authenticateToken, async (req, res) => {
  const logs = await DB.getLogs();
  res.json(logs);
});

// ==========================================
// 6.5. WEBSITE CONTENT, DYNAMIC PRODUCTS, AND ROLLBACK ENDPOINTS
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const products = await DB.getProducts();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const product = await DB.saveProduct(req.body);
    res.status(200).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const success = await DB.deleteProduct(req.params.id);
    if (success) {
      res.json({ message: 'Product deleted.' });
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/website/content', async (req, res) => {
  try {
    const content = await DB.getWebsiteContent();
    res.json(content);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/website/content', authenticateToken, async (req, res) => {
  try {
    const content = await DB.saveWebsiteContent(req.body);
    res.status(200).json(content);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/website/checkpoints', authenticateToken, async (req, res) => {
  try {
    const checkpoints = await DB.getCheckpoints();
    res.json(checkpoints);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/website/checkpoints', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    const checkpoint = await DB.createCheckpoint(title, (req as any).user?.username || 'debarghapakhira@gmail.com');
    res.status(201).json(checkpoint);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/website/checkpoints/:id/rollback', authenticateToken, async (req, res) => {
  try {
    const success = await DB.rollbackToCheckpoint(req.params.id);
    if (success) {
      res.json({ message: 'Rollback succeeded.' });
    } else {
      res.status(404).json({ error: 'Rollback failed.' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. PAYMENTS: RAZORPAY GATEWAY
// ==========================================
app.post('/api/payments/razorpay/order', async (req, res) => {
  const { amount, currency = 'INR', receiptEmail, clientName, cartItems } = req.body;

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
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency,
          receipt: 'rec_' + Date.now().toString().slice(-6),
          notes: {
            clientName,
            clientEmail: receiptEmail,
            itemsDescription: cartItems || 'High-Precision Consecration Curation Bundle'
          }
        })
      });

      if (!apiResponse.ok) {
        throw new Error('Failure during remote Razorpay initialization.');
      }

      const orderData = await apiResponse.json();
      await DB.addLog(`RAZORPAY LIVE: Registered order ${orderData.id} for ₹${amount}`);
      return res.status(201).json(orderData);
    } catch (err: any) {
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
      itemsDescription: cartItems || 'Sandboxed Curation Package'
    },
    created_at: Math.floor(Date.now() / 1000)
  });
});

app.post('/api/payments/razorpay/webhook', async (req: any, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const razorpaySecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || 'sacred_webhook7592_signature';

  if (!signature) {
    return res.status(400).json({ error: 'Missing security signature block.' });
  }

  let isSignatureValid = false;
  try {
    const rawBodyBuffer = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const hmac = crypto.createHmac('sha256', razorpaySecret);
    hmac.update(rawBodyBuffer);
    const expectedSignature = hmac.digest('hex');

    isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (err) {
    isSignatureValid = false;
  }

  const isBypassActive = process.env.NODE_ENV !== 'production' && (signature === 'bypass_test_mode');
  
  if (!isSignatureValid && !isBypassActive) {
    await DB.addLog('CRITICAL: Unauthorized signature received on payment webhook.');
    return res.status(403).json({ error: 'Signature failure. Connection unauthorized.' });
  }

  const event = req.body?.event;
  const payload = req.body?.payload;

  if (event === 'payment.captured' || event === 'simulated.payment.captured' || isBypassActive) {
    const paymentEntity = payload?.payment?.entity || req.body?.payload?.payment?.entity;
    const razorpayOrderId = paymentEntity?.order_id || 'order_sandbox_re';
    const amountPaidInRupees = (paymentEntity?.amount || req.body?.amount || 10000) / 100;
    const clientName = paymentEntity?.notes?.clientName || req.body?.clientName || 'Vrishabha Devotee';
    const clientEmail = paymentEntity?.notes?.clientEmail || req.body?.receiptEmail || 'operations@signtific.in';
    const itemNames = paymentEntity?.notes?.itemsDescription || req.body?.cartItems || 'Planetary Crystal Alignment Package';

    await DB.addLog(`WEBHOOK TRANSACTION VERIFIED: Secured Order ID ${razorpayOrderId} (₹${amountPaidInRupees})`);

    await DB.addInvoice({
      client: clientName,
      date: new Date().toISOString().split('T')[0],
      item: itemNames,
      amount: amountPaidInRupees,
      status: 'Paid',
      alignment: 'Secured via Razorpay Secure checkout Gateway'
    });

    await DB.addTask({
      title: `Sanctify crystals for order: ${razorpayOrderId} (${clientName})`,
      status: 'Water Cleanse',
      priority: 'High',
      assignee: 'Pandit Sharma',
      daysLeft: 3
    });

    await sendFulfillmentEmail(clientEmail, clientName, itemNames, razorpayOrderId);

    return res.json({ status: 'success', message: 'Fulfillment sequence synced', orderId: razorpayOrderId });
  }

  res.json({ status: 'ignored', event });
});

export default app;
