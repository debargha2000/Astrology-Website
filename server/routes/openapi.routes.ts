import { Router, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { openApiSpec } from '../openapi.js';

const router = Router();

router.get('/spec', (_req, res: Response) => {
  res.json(openApiSpec);
});

router.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Aura & Stone API Documentation',
  })
);

export default router;
