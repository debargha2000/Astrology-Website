/**
 * Lightweight, dependency-free CSRF protection middleware.
 *
 * Replaces the deprecated `csurf` package. Behaviour matches the
 * original implementation that this codebase relied on:
 *
 *   1. The SPA calls GET /api/csrf-token to obtain a CSRF token.
 *      The server generates a random secret, signs it with the
 *      cookie secret, stores the raw secret in a signed `_csrf`
 *      cookie, and returns the raw token to the client.
 *   2. The SPA echoes the token back via the `X-CSRF-Token` header
 *      on state-changing requests (POST/PUT/PATCH/DELETE).
 *   3. The middleware verifies that the header token matches the
 *      signed cookie token using a constant-time comparison.
 *   4. Safe methods (GET/HEAD/OPTIONS) are not protected, matching
 *      standard CSRF semantics.
 *
 * The Razorpay webhook path is excluded by the caller because it
 * is verified via HMAC signature instead.
 */

import crypto from 'crypto';

import type { Request, Response, NextFunction, RequestHandler } from 'express';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const TOKEN_HEADER = 'x-csrf-token';
const COOKIE_KEY = '_csrf';
const TOKEN_BYTES = 32;

/* eslint-disable @typescript-eslint/no-shadow */
declare module 'express-serve-static-core' {
  interface Request {
    csrfToken?: () => string;
  }
}

function signToken(secret: string, cookieSecret: string): string {
  return crypto.createHmac('sha256', cookieSecret).update(secret).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function attachTokenGenerator(
  req: Request,
  res: Response,
  cookieKey: string,
  cookieSecret: string
): void {
  req.csrfToken = () => {
    const existing = req.signedCookies?.[cookieKey] as string | undefined;
    if (existing) return existing;
    const secret = crypto.randomBytes(TOKEN_BYTES).toString('hex');
    const signed = signToken(secret, cookieSecret);
    res.cookie(cookieKey, signed, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    });
    return signed;
  };
}

export interface CsrfOptions {
  cookieSecret: string;
  exemptPaths?: Set<string>;
  cookieKey?: string;
  tokenHeader?: string;
}

export function createCsrfProtection(options: CsrfOptions): RequestHandler {
  const {
    cookieSecret,
    exemptPaths = new Set(),
    cookieKey = COOKIE_KEY,
    tokenHeader = TOKEN_HEADER,
  } = options;
  const headerLower = tokenHeader.toLowerCase();

  return function csrfProtection(req: Request, res: Response, next: NextFunction): void {
    if (exemptPaths.has(req.path)) {
      attachTokenGenerator(req, res, cookieKey, cookieSecret);
      return next();
    }

    const method = req.method.toUpperCase();
    if (SAFE_METHODS.has(method)) {
      attachTokenGenerator(req, res, cookieKey, cookieSecret);
      return next();
    }

    const cookieToken = (req.signedCookies?.[cookieKey] as string | undefined) ?? '';
    const headerTokenRaw = req.headers[headerLower];
    const headerToken = Array.isArray(headerTokenRaw) ? headerTokenRaw[0] : headerTokenRaw;

    if (!cookieToken || !headerToken) {
      return next(Object.assign(new Error('CSRF token missing'), { code: 'EBADCSRFTOKEN' }));
    }

    if (!safeEqual(cookieToken, headerToken)) {
      return next(Object.assign(new Error('CSRF token mismatch'), { code: 'EBADCSRFTOKEN' }));
    }

    attachTokenGenerator(req, res, cookieKey, cookieSecret);
    return next();
  };
}
