import request, { Agent } from 'supertest';

// Set environment variables for testing BEFORE importing app
process.env.NODE_ENV = 'test';
process.env.DISABLE_REDIS_RATE_LIMIT = 'true';
process.env.JWT_SECRET = 'test-secret-that-is-at-least-32-characters-long-for-testing';
process.env.COOKIE_SECRET = 'test-cookie-secret-that-is-at-least-32-characters-long-for-testing';

import app from '../app.js';

describe('API Integration Tests', () => {
  let agent: Agent;
  let authToken: string;
  let csrfToken: string;

  beforeAll(async () => {
    agent = request.agent(app);

    // 1. Obtain CSRF token
    const csrfRes = await agent.get('/api/csrf-token');
    csrfToken = csrfRes.body.csrfToken;

    // 2. Obtain Auth Token
    const authRes = await agent.post('/api/auth/google-login').set('X-CSRF-Token', csrfToken).send({
      email: 'debarghapakhira@gmail.com',
      uid: 'test-admin-uid',
      displayName: 'Admin User',
    });
    authToken = authRes.body.token;
  });

  describe('System & Auth', () => {
    it('should return 403 for unauthorized google login with wrong email', async () => {
      const res = await agent.post('/api/auth/google-login').set('X-CSRF-Token', csrfToken).send({
        email: 'wrong-email@gmail.com',
        uid: 'test-uid',
        displayName: 'Test User',
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/Access Denied/);
    });
  });

  describe('Invoices API', () => {
    it('should fetch invoices with valid token', async () => {
      const res = await agent.get('/api/invoices').set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should deny access to invoices without token', async () => {
      const res = await request(app).get('/api/invoices');
      expect(res.status).toBe(401);
    });

    it('should create a new invoice', async () => {
      const newInvoice = {
        client: 'Test Client',
        amount: 5000,
        item: 'Test Item',
        status: 'Sent',
        alignment: 'Test Alignment',
      };
      const res = await agent
        .post('/api/invoices')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send(newInvoice);
      expect(res.status).toBe(201);
      expect(res.body.client).toBe('Test Client');
      expect(res.body.amount).toBe(5000);
    });
  });

  describe('Vendor API', () => {
    it('should list vendors', async () => {
      const res = await agent.get('/api/vendors').set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a vendor', async () => {
      const vendor = {
        name: 'Test Vendor',
        contact: 'Test Contact',
        origin: 'Test Origin',
        category: 'Test Category',
        leadTime: '1 Day',
        leadGems: 'Test Gems',
      };
      const res = await agent
        .post('/api/vendors')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send(vendor);
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Test Vendor');
    });
  });

  describe('Expense API', () => {
    it('should list expenses', async () => {
      const res = await agent.get('/api/expenses').set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create an expense', async () => {
      const expense = {
        title: 'Test Expense',
        amount: 100,
        category: 'Test Category',
        notes: 'Test notes',
      };
      const res = await agent
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send(expense);
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Expense');
    });
  });

  describe('Task API', () => {
    it('should create a task', async () => {
      const task = {
        title: 'New Task',
        assignee: 'Test Assignee',
        priority: 'High',
        status: 'Backlog',
      };
      const res = await agent
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send(task);
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Task');
    });

    it('should update task status', async () => {
      const taskRes = await agent
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({ title: 'Status Change Task', assignee: 'test' });
      const taskId = taskRes.body.id;

      const res = await agent
        .put(`/api/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({ status: 'Water Cleanse' });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Water Cleanse');
    });
  });

  describe('Product API', () => {
    it('should fetch products (publicly)', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a product', async () => {
      const product = {
        id: 'TEST-PROD-001',
        name: 'Test Product',
        originalPrice: 2000,
        salePrice: 1500,
        rating: 4.5,
        reviewsCount: 10,
        description: 'A test product',
        shortDescription: 'Test short description',
        benefits: ['Benefit 1', 'Benefit 2'],
        crystalsUsed: ['Crystal 1'],
        imageUrl: 'https://example.com/image.jpg',
        videoUrl: 'https://example.com/video.mp4',
        category: 'bracelet',
        stockStatus: 'in-stock',
        zodiacConnection: ['Aries', 'Leo'],
        specifications: {
          beadSize: '8mm',
          beadCount: 20,
          threadMaterial: 'Elastic',
          origin: 'India',
          chargeTime: '3 Nights',
        },
      };
      const res = await agent
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send(product);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test Product');
    });
  });

  describe('Payment API', () => {
    it('should create a razorpay order (sandbox mode)', async () => {
      const res = await agent
        .post('/api/payments/razorpay/order')
        .set('Authorization', `Bearer ${authToken}`)
        .set('X-CSRF-Token', csrfToken)
        .send({
          amount: 1000,
          clientName: 'Test Client',
          receiptEmail: 'test@example.com',
        });
      expect(res.status).toBe(201);
      expect(res.body.id).toMatch(/^order_/);
    });
  });
});
