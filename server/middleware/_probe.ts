// Re-exports the internal `getJwtSecret` so unit tests can probe it
// without invoking the Express middleware.
export { getJwtSecret } from './auth.js';
