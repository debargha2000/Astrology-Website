import { Request, Response, NextFunction, RequestHandler } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import { logger } from './logging.js';

let redisClient: Redis | null = null;
let rateLimiter: RateLimiterRedis | null = null;
let redisInitAttempted = false;
let redisInitFailed = false;

const isTestEnv =
  process.env.NODE_ENV === 'test' || process.env.DISABLE_REDIS_RATE_LIMIT === 'true';

export function initRedisRateLimiter(): void {
  if (isTestEnv) {
    logger.info('Redis rate limiter disabled in test environment');
    return;
  }

  if (redisInitAttempted) {
    return;
  }
  redisInitAttempted = true;

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
      enableReadyCheck: true,
      lazyConnect: true,
      connectTimeout: 2000,
    });

    redisClient.on('error', (err) => {
      if (!redisInitFailed) {
        logger.warn({ err }, 'Redis connection failed, rate limiting will use in-memory fallback');
        redisInitFailed = true;
      }
    });

    redisClient.on('connect', () => {
      logger.info('Redis connected for rate limiting');
      redisInitFailed = false;
    });

    redisClient.connect().catch(() => {
      if (!redisInitFailed) {
        logger.warn('Redis connection failed, rate limiting will use in-memory fallback');
        redisInitFailed = true;
      }
    });

    rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'rl:',
      points: 100,
      duration: 60,
      blockDuration: 60 * 15,
    });

    logger.info('Redis rate limiter initialized');
  } catch (err) {
    logger.warn({ err }, 'Failed to initialize Redis rate limiter, falling back to in-memory');
    redisInitFailed = true;
  }
}

function createInMemoryLimiter(options: {
  points: number;
  duration: number;
  keyPrefix?: string;
  blockDuration?: number;
}): RequestHandler {
  const store = new Map<string, { points: number; expires: number }>();

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = `${options.keyPrefix || 'rl:'}${req.ip}:${req.path}`;
    const now = Date.now();

    let entry = store.get(key);
    if (!entry || entry.expires < now) {
      entry = { points: options.points, expires: now + options.duration * 1000 };
      store.set(key, entry);
    }

    if (entry.points > 0) {
      entry.points--;
      next();
    } else {
      const secs = Math.ceil((entry.expires - now) / 1000) || 1;
      res.set('Retry-After', String(secs));
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: secs,
      });
    }
  };
}

export function createRateLimiter(options: {
  points: number;
  duration: number;
  keyPrefix?: string;
  blockDuration?: number;
}): RequestHandler {
  if (isTestEnv) {
    return async (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
      next();
    };
  }

  const inMemoryLimiter = createInMemoryLimiter(options);

  if (!rateLimiter && !redisInitFailed) {
    initRedisRateLimiter();
  }

  let limiter: RateLimiterRedis | null = null;
  if (redisClient) {
    limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: options.keyPrefix || 'rl:',
      points: options.points,
      duration: options.duration,
      blockDuration: options.blockDuration || 60 * 15,
    });
  }

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const isDev =
      process.env.NODE_ENV === 'development' ||
      !process.env.NODE_ENV ||
      process.env.NODE_ENV === 'unset';

    if (redisInitFailed || isDev || !limiter) {
      return inMemoryLimiter(req, res, next);
    }

    const key = `${options.keyPrefix || 'rl:'}${req.ip}:${req.path}`;

    try {
      await limiter.consume(key);
      next();
    } catch (rejRes: unknown) {
      const isRedisError =
        rejRes instanceof Error ||
        (rejRes &&
          typeof rejRes === 'object' &&
          !('msBeforeNext' in (rejRes as Record<string, unknown>)));

      if (isRedisError) {
        logger.warn({ err: rejRes }, 'Rate limiter Redis error, falling back to in-memory');
        return inMemoryLimiter(req, res, next);
      }

      const secs = Math.round((rejRes as { msBeforeNext: number }).msBeforeNext / 1000) || 1;
      res.set('Retry-After', String(secs));
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: secs,
      });
    }
  };
}

export const authRateLimiter = createRateLimiter({
  points: 10,
  duration: 15 * 60,
  keyPrefix: 'rl:auth:',
  blockDuration: 60 * 15,
});

export const apiRateLimiter = createRateLimiter({
  points: 100,
  duration: 60,
  keyPrefix: 'rl:api:',
});

export const paymentRateLimiter = createRateLimiter({
  points: 30,
  duration: 15 * 60,
  keyPrefix: 'rl:payment:',
  blockDuration: 60 * 30,
});

export const aiRateLimiter = createRateLimiter({
  points: 20,
  duration: 60,
  keyPrefix: 'rl:ai:',
  blockDuration: 60 * 5,
});

export async function shutdownRedisRateLimiter(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis rate limiter shut down');
  }
}
