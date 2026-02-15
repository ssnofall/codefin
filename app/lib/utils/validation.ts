import { validate as validateUUID } from 'uuid'
import {
  MAX_TAG_LENGTH,
  VALID_TAG_REGEX,
  VALID_LANGUAGE_REGEX,
  MAX_COMMENT_LENGTH,
  ALLOWED_REDIRECT_PATHS,
} from './constants'

/**
 * Validates UUID format
 */
export function validateId(id: string, fieldName: string = 'ID'): void {
  if (!validateUUID(id)) {
    throw new Error(`Invalid ${fieldName} format`)
  }
}

/**
 * Validates tag format (alphanumeric + hyphen, max length)
 */
export function validateTag(tag: string): boolean {
  if (tag.length > MAX_TAG_LENGTH) return false
  if (!VALID_TAG_REGEX.test(tag)) return false
  return true
}

/**
 * Validates and sanitizes language identifier
 */
export function validateLanguage(language: string): string {
  const sanitized = language.toLowerCase().trim()
  
  if (!sanitized || !VALID_LANGUAGE_REGEX.test(sanitized)) {
    throw new Error('Invalid language format')
  }
  
  return sanitized
}

/**
 * Validates redirect path is in allowed list
 */
export function validateRedirectPath(path: string): string {
  // Remove any query parameters for validation
  const cleanPath = path.split('?')[0]
  
  if (ALLOWED_REDIRECT_PATHS.includes(cleanPath as typeof ALLOWED_REDIRECT_PATHS[number])) {
    return path
  }
  
  return '/feed'
}

/**
 * Strips all HTML tags from text
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Sanitizes comment body (text-only, no HTML)
 */
export function sanitizeComment(body: string): string {
  const trimmed = body.trim()
  
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    throw new Error(`Comment must be less than ${MAX_COMMENT_LENGTH} characters`)
  }
  
  // Strip all HTML tags from comments
  return stripHtml(trimmed)
}

/**
 * Sanitizes tag string
 */
export function sanitizeTagString(tag: string): string {
  return tag.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
}
