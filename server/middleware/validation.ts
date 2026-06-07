import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

import { logger } from './logging.js';

export interface ValidatedRequest extends Request {
  validated?: unknown;
}

export function validate(schema: ZodSchema): RequestHandler {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        logger.warn({ errors, path: req.path, method: req.method }, 'Validation failed');
        res.status(422).json({
          error: 'Validation failed',
          issues: errors,
        });
        return;
      }
      req.validated = result.data;
      next();
    } catch (err) {
      logger.error({ err, path: req.path, method: req.method }, 'Validation error');
      res.status(500).json({ error: 'Internal validation error' });
    }
  };
}

export function validateQuery(schema: ZodSchema): RequestHandler {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.query);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        res.status(422).json({
          error: 'Query validation failed',
          issues: errors,
        });
        return;
      }
      req.validated = result.data;
      next();
    } catch (err) {
      logger.error({ err, path: req.path, method: req.method }, 'Query validation error');
      res.status(500).json({ error: 'Internal validation error' });
    }
  };
}

export function validateParams(schema: ZodSchema): RequestHandler {
  return (req: ValidatedRequest, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.params);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        res.status(422).json({
          error: 'Parameter validation failed',
          issues: errors,
        });
        return;
      }
      req.validated = result.data;
      next();
    } catch (err) {
      logger.error({ err, path: req.path, method: req.method }, 'Params validation error');
      res.status(500).json({ error: 'Internal validation error' });
    }
  };
}
