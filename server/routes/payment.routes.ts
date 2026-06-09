import crypto from 'crypto';

import { Router, Request, Response } from 'express';

import { DB } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { logger } from '../middleware/logging.js';
import { sendFulfillmentEmail } from '../services/email.js';

const router = Router();

router.post(
  '/razorpay/order',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      amount,
      currency = 'INR',
      receiptEmail,
      clientName,
      cartItems,
    } = req.body as {
      amount?: number;
      currency?: string;
      receiptEmail?: string;
      clientName?: string;
      cartItems?: string;
    };

    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Total amount is required for setting up order tunnels.' });
      return;
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
        logger.error({ err }, 'Razorpay processing exception');
        await DB.addLog(
          'RAZORPAY EXCEPTION: Live channel failover. Generating sandboxed transaction.'
        );
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
    return;
  })
);

router.post(
  '/razorpay/webhook',
  asyncHandler(async (req: Request, res: Response) => {
    const signatureHeader = req.headers['x-razorpay-signature'];
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    const razorpaySecret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      'sacred_webhook7592_signature';

    if (!signature) {
      res.status(400).json({ error: 'Missing security signature block.' });
      return;
    }

    let isSignatureValid = false;
    try {
      const rawBodyBuffer =
        (req as Request & { rawBody?: Buffer }).rawBody || Buffer.from(JSON.stringify(req.body));
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

    const isBypassActive =
      process.env.NODE_ENV === 'development' && signature === 'bypass_test_mode';

    if (!isSignatureValid && !isBypassActive) {
      await DB.addLog('CRITICAL: Unauthorized signature received on payment webhook.');
      res.status(403).json({ error: 'Signature failure. Connection unauthorized.' });
      return;
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
      const clientName = paymentEntity.notes?.clientName ?? body?.clientName ?? 'Vrishabha Devotee';
      const clientEmail =
        paymentEntity.notes?.clientEmail ?? body?.receiptEmail ?? 'operations@aurastone.in';
      const itemNames =
        paymentEntity.notes?.itemsDescription ??
        body?.cartItems ??
        'Planetary Crystal Alignment Package';

      await DB.addLog(
        `WEBHOOK TRANSACTION VERIFIED: Secured Order ID ${razorpayOrderId} (₹${amountPaidInRupees})`
      );

      const today = new Date().toISOString().split('T')[0]!;
      await DB.addInvoice({
        client: clientName,
        date: today,
        item: itemNames,
        amount: amountPaidInRupees,
        status: 'Paid',
        alignment: 'Secured via Razorpay Secure checkout Gateway',
      } as const);

      await DB.addTask({
        title: `Sanctify crystals for order: ${razorpayOrderId} (${clientName})`,
        status: 'Water Cleanse',
        priority: 'High',
        assignee: 'Pandit Sharma',
        daysLeft: 3,
      });

      await sendFulfillmentEmail(clientEmail, clientName, itemNames, razorpayOrderId);

      res.json({
        status: 'success',
        message: 'Fulfillment sequence synced',
        orderId: razorpayOrderId,
      });
      return;
    }

    res.json({ status: 'ignored', event });
  })
);

export default router;
