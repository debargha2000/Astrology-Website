/**
 * Server-side configuration constants.
 *
 * Centralizes environment-driven values so they can be:
 *   - validated once at boot
 *   - mocked in unit tests
 *   - documented in a single place
 */

const DEFAULT_ADMIN_EMAIL = 'debarghapakhira@gmail.com';

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).toLowerCase();
}

export interface RazorpaySecrets {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
}

/**
 * Reads Razorpay secrets. In production, all three are required —
 * the server will refuse to start if any are missing. In dev, a
 * clear `null` is returned so the caller can fall back to the
 * sandbox flow.
 */
export function getRazorpaySecrets(): RazorpaySecrets | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (process.env.NODE_ENV === 'production') {
    if (!keyId || !keySecret || !webhookSecret) {
      throw new Error(
        'FATAL: In production, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and ' +
          'RAZORPAY_WEBHOOK_SECRET must all be set. Refusing to start with insecure defaults.'
      );
    }
    return { keyId, keySecret, webhookSecret };
  }

  if (!keyId || !keySecret) return null;
  return { keyId, keySecret, webhookSecret: webhookSecret || keySecret };
}
