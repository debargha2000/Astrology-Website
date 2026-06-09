/**
 * Async route handler wrapper.
 *
 * Catches rejected promises from async Express route handlers and
 * forwards them to Express's error-handling middleware instead of
 * crashing the process with an unhandled rejection.
 *
 * Usage:
 *   router.get('/foo', asyncHandler(async (req, res) => { ... }));
 */
import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
