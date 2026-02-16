/**
 * Generates a cryptographically secure nonce for CSP
 * Uses Web Crypto API for Edge Runtime compatibility
 * @returns Base64 encoded nonce string
 */
export function generateNonce(): string {
  // Use Web Crypto API (available in both Node.js and Edge Runtime)
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Sanitizes error messages to prevent information disclosure
 * @param error The error object or message
 * @param fallback Generic fallback message
 * @returns Sanitized error message safe for client consumption
 */
export function sanitizeErrorMessage(error: unknown, fallback: string = 'An error occurred. Please try again.'): string {
  // Log the actual error server-side (callers should handle this)
  console.error('Error details:', error);
  
  // Return generic message to client
  return fallback;
}

/**
 * Validates if a nonce is properly formatted
 * @param nonce The nonce to validate
 * @returns boolean indicating if nonce is valid
 */
export function isValidNonce(nonce: string | null): boolean {
  if (!nonce) return false;
  // Nonce should be base64 encoded UUID (roughly 24 characters)
  return nonce.length >= 20 && nonce.length <= 50 && /^[A-Za-z0-9+/=]+$/.test(nonce);
}
