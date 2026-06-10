/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';

import { Router, Request, Response } from 'express';
import { GoogleAuth } from 'google-auth-library';

import { getAdminEmail } from '../config.js';
import { DB } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { signToken } from '../middleware/auth.js';
import { logger } from '../middleware/logging.js';

const router = Router();

interface ServiceAccount {
  project_id?: string;
  client_email?: string;
  private_key?: string;
}

interface RecaptchaAssessmentResponse {
  tokenProperties?: {
    valid: boolean;
    invalidReason?: string;
    action?: string;
  };
  riskAnalysis?: {
    score: number;
  };
}

async function verifyRecaptchaToken(token: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'test') {
    return true; // Bypass in tests
  }

  // Get project ID & Service Account info
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  let credentials: ServiceAccount | null = null;
  if (envKey) {
    try {
      credentials = JSON.parse(envKey) as ServiceAccount;
    } catch {}
  } else {
    const SERVICE_ACCOUNT_PATH = path.join(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
      try {
        credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8')) as ServiceAccount;
      } catch {}
    }
  }

  if (!credentials) {
    logger.warn('reCAPTCHA verification skipped: Service account not configured.');
    return true;
  }

  const projectId = credentials.project_id || 'aura-and-stone';

  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments`;

    const response = await client.request<RecaptchaAssessmentResponse>({
      url,
      method: 'POST',
      data: {
        event: {
          token: token,
          siteKey: '6LcR3BYtAAAAADCM1FX9t5PQkE7Ebp5ow43b9mhY',
          expectedAction: 'LOGIN',
        },
      },
    });

    const data = response.data;
    if (!data.tokenProperties?.valid) {
      logger.error(`reCAPTCHA token invalid: ${data.tokenProperties?.invalidReason || 'N/A'}`);
      return false;
    }

    if (data.tokenProperties.action !== 'LOGIN') {
      logger.error(`reCAPTCHA action mismatch: ${data.tokenProperties.action || 'N/A'}`);
      return false;
    }

    const score = data.riskAnalysis?.score ?? 0;
    if (score < 0.5) {
      logger.warn(`reCAPTCHA risk score too low: ${score}`);
      return false;
    }

    return true;
  } catch (error) {
    logger.error({ err: error }, 'reCAPTCHA verification error');
    return false;
  }
}

router.post(
  '/google-login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, uid, displayName, recaptchaToken } = req.body as {
      email?: string;
      uid?: string;
      displayName?: string;
      recaptchaToken?: string;
    };

    if (!email) {
      return res.status(400).json({ error: 'Google email coordinate is required.' });
    }

    const emailLower = email.toLowerCase();

    if (emailLower !== getAdminEmail()) {
      await DB.addLog(
        `SECURITY AUDIT FAILURE: Unauthorized Google login attempt made by "${emailLower}".`
      );
      return res
        .status(403)
        .json({ error: `Access Denied: ${getAdminEmail()} is the only authorized account.` });
    }

    if (process.env.NODE_ENV !== 'test') {
      // Allow bypass ONLY if service account isn't configured at all
      const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      const serviceAccountExists =
        !!envKey || fs.existsSync(path.join(process.cwd(), 'serviceAccountKey.json'));

      if (serviceAccountExists) {
        if (!recaptchaToken) {
          await DB.addLog(
            `SECURITY AUDIT FAILURE: Google login attempt rejected due to missing reCAPTCHA token.`
          );
          return res.status(400).json({ error: 'reCAPTCHA token is required.' });
        }
        const isValid = await verifyRecaptchaToken(recaptchaToken);
        if (!isValid) {
          await DB.addLog(
            `SECURITY AUDIT FAILURE: Google login attempt rejected due to invalid/high-risk reCAPTCHA token.`
          );
          return res.status(400).json({ error: 'reCAPTCHA verification failed. Access denied.' });
        }
      }
    }

    const token = signToken({
      id: uid || 'google-admin-id',
      username: emailLower,
      email: emailLower,
      role: 'admin',
    });

    await DB.addLog(
      `STAFF LOG IN: Google Sign-In completed for "${emailLower}" (${displayName || 'N/A'}).`
    );
    return res.json({ token, role: 'admin', username: emailLower });
  })
);

export default router;
