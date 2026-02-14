// App constants - abstracted for easy renaming
export const APP_NAME = 'Stackd'
export const SCORE_LABEL = 'Score'

// Navigation items
export const NAV_ITEMS = [
  { label: 'Feed', href: '/feed' },
  { label: 'Trending', href: '/trending' },
  { label: 'New', href: '/new' },
  { label: 'Top', href: '/top' },
] as const

// Programming languages for dropdown
export const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Go',
  'Rust',
  'Java',
  'C++',
  'C#',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
  'HTML',
  'CSS',
  'SQL',
  'Shell',
  'Other',
] as const

// Post limits
export const MAX_TAGS = 5
export const CODE_PREVIEW_LINES = 20

// Input validation limits
export const MAX_TITLE_LENGTH = 200
export const MAX_CODE_LENGTH = 100000 // 100KB
export const MAX_COMMENT_LENGTH = 5000
export const MAX_FILE_NAME_LENGTH = 100
export const MAX_TAG_LENGTH = 30
export const COMMENTS_PER_PAGE = 50

// Validation regex patterns
export const VALID_TAG_REGEX = /^[a-z0-9-]+$/
export const VALID_LANGUAGE_REGEX = /^[a-zA-Z0-9+#-.]+$/

// Allowed redirect paths for auth callback
export const ALLOWED_REDIRECT_PATHS = [
  '/feed',
  '/new',
  '/top',
  '/trending',
  '/saved',
  '/settings',
  '/create',
] as const

// Sort options
export const SORT_OPTIONS = [
  { label: 'Hot', value: 'hot' },
  { label: 'New', value: 'new' },
  { label: 'Top', value: 'top' },
] as const
