import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is missing or too short (min 32 chars). ' +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(48).toString('base64url'))\""
    );
  }
  return secret;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  let secret: string;
  try {
    secret = getJwtSecret();
  } catch {
    return res.status(500).json({ error: 'Server misconfigured: JWT secret unavailable.' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing divine session credentials.' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Astral session expired or corrupt.' });
    }
    req.user = decoded as AuthUser;
    next();
  });
}

export function signToken(payload: AuthUser): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '8h' });
}
