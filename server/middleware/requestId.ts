import crypto from 'crypto';

import { Request, Response, NextFunction, RequestHandler } from 'express';

import { logger } from './logging.js';

declare global {
  namespace Express {
    interface Request {
      id: string;
      startTime: number;
    }
  }
}

export const requestId: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  req.id = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.startTime = Date.now();
  next();
};

export const requestLogger: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const originalSend = res.send;
  res.send = function (body?: unknown): Response {
    const duration = Date.now() - req.startTime;
    const log = logger.child({
      reqId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    if (res.statusCode >= 400) {
      log.warn(
        { body: typeof body === 'string' ? body.slice(0, 500) : body },
        'Request completed with error'
      );
    } else {
      log.info('Request completed');
    }

    return originalSend.call(this, body);
  };
  next();
};
