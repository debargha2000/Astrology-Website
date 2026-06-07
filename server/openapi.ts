export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Aura & Stone API',
    version: '1.0.0',
    description: 'API for Aura & Stone - Vedic Crystal Astrology E-commerce',
    contact: {
      name: 'Aura & Stone',
      email: 'operations@aurastone.in',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'API Base Path',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      csrfToken: {
        type: 'apiKey',
        in: 'header',
        name: 'X-CSRF-Token',
      },
    },
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          originalPrice: { type: 'integer' },
          salePrice: { type: 'integer' },
          rating: { type: 'number' },
          reviewsCount: { type: 'integer' },
          description: { type: 'string' },
          shortDescription: { type: 'string' },
          benefits: { type: 'array', items: { type: 'string' } },
          crystalsUsed: { type: 'array', items: { type: 'string' } },
          imageUrl: { type: 'string', format: 'uri' },
          videoUrl: { type: 'string', format: 'uri', nullable: true },
          category: { type: 'string', enum: ['bracelet', 'ring', 'combo', 'zodiac'] },
          stockStatus: { type: 'string', enum: ['in-stock', 'low-stock', 'pre-order'] },
          zodiacConnection: { type: 'array', items: { type: 'string' } },
          isBestSeller: { type: 'boolean' },
          specifications: {
            type: 'object',
            properties: {
              beadSize: { type: 'string' },
              beadCount: { type: 'integer' },
              threadMaterial: { type: 'string' },
              origin: { type: 'string' },
              chargeTime: { type: 'string' },
            },
          },
        },
      },
      Invoice: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          client: { type: 'string' },
          date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
          item: { type: 'string' },
          amount: { type: 'integer' },
          status: { type: 'string', enum: ['Paid', 'Sent', 'Overdue', 'Draft'] },
          alignment: { type: 'string' },
        },
      },
      Vendor: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          contact: { type: 'string' },
          origin: { type: 'string' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          category: { type: 'string' },
          leadTime: { type: 'string' },
          leadGems: { type: 'string' },
          status: { type: 'string', enum: ['Approved', 'Under Review', 'Suspended'] },
        },
      },
      Expense: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          category: { type: 'string' },
          amount: { type: 'integer' },
          date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
          notes: { type: 'string' },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          status: {
            type: 'string',
            enum: ['Backlog', 'Water Cleanse', 'Moon Bath Bathing', 'Sealed / Composed'],
          },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          assignee: { type: 'string' },
          daysLeft: { type: 'integer' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/products': {
      get: {
        summary: 'Get all products',
        responses: {
          '200': {
            description: 'List of products',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Product' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a product',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Product created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
        },
      },
    },
    '/invoices': {
      get: {
        summary: 'Get all invoices',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of invoices',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Invoice' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create an invoice',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['client', 'amount'],
                properties: {
                  client: { type: 'string' },
                  item: { type: 'string' },
                  amount: { type: 'integer' },
                  status: { type: 'string', enum: ['Paid', 'Sent', 'Overdue', 'Draft'] },
                  alignment: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Invoice created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Invoice' },
              },
            },
          },
        },
      },
    },
    '/ai/recommendations': {
      post: {
        summary: 'Get AI product recommendations',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userBirthDetails'],
                properties: {
                  userBirthDetails: {
                    type: 'object',
                    required: ['name', 'birthDate'],
                    properties: {
                      name: { type: 'string' },
                      birthDate: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
                      birthTime: { type: 'string' },
                      birthPlace: { type: 'string' },
                    },
                  },
                  currentCart: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        category: { type: 'string' },
                        crystalsUsed: { type: 'array', items: { type: 'string' } },
                      },
                    },
                  },
                  purchaseHistory: { type: 'array', items: { type: 'string' } },
                  userPreferences: {
                    type: 'object',
                    properties: {
                      budget: { type: 'string', enum: ['low', 'medium', 'high'] },
                      style: { type: 'string', enum: ['minimal', 'statement', 'spiritual'] },
                      intent: {
                        type: 'string',
                        enum: [
                          'wealth',
                          'protection',
                          'health',
                          'relationships',
                          'career',
                          'general',
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'AI recommendations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    result: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/ai/chatbot': {
      post: {
        summary: 'Chat with AI assistant',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  message: { type: 'string' },
                  conversationHistory: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', enum: ['user', 'assistant'] },
                        content: { type: 'string' },
                      },
                    },
                  },
                  userContext: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      isAuthenticated: { type: 'boolean' },
                      cartItems: { type: 'integer' },
                      currentPage: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Chatbot response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    result: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
