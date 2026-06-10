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

interface VerificationResult {
  isValid: boolean;
  reason?: string;
}

async function verifyRecaptchaToken(token: string): Promise<VerificationResult> {
  if (process.env.NODE_ENV === 'test') {
    return { isValid: true };
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
    return { isValid: true };
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
      const msg = `reCAPTCHA token invalid: ${data.tokenProperties?.invalidReason || 'Unknown reason'}`;
      logger.error(msg);
      return { isValid: false, reason: msg };
    }

    if (data.tokenProperties.action !== 'LOGIN') {
      const msg = `reCAPTCHA action mismatch: expected LOGIN, got ${data.tokenProperties.action || 'none'}`;
      logger.error(msg);
      return { isValid: false, reason: msg };
    }

    const score = data.riskAnalysis?.score ?? 0;
    if (score < 0.5) {
      const msg = `reCAPTCHA risk score too low: ${score}`;
      logger.warn(msg);
      return { isValid: false, reason: msg };
    }

    return { isValid: true };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error({ err: error }, 'reCAPTCHA verification error');
    return { isValid: false, reason: `GCP API Error: ${errorMsg}` };
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
        const result = await verifyRecaptchaToken(recaptchaToken);
        if (!result.isValid) {
          await DB.addLog(
            `SECURITY AUDIT FAILURE: Google login attempt rejected due to invalid/high-risk reCAPTCHA token. Reason: ${result.reason || ''}`
          );
          return res
            .status(400)
            .json({ error: `reCAPTCHA verification failed. ${result.reason || ''}` });
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
