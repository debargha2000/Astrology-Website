import { Router, Request, Response } from 'express';

import { getAdminEmail } from '../config.js';
import { DB } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

router.post(
  '/google-login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, uid, displayName } = req.body as {
      email?: string;
      uid?: string;
      displayName?: string;
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
