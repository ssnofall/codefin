// App constants - abstracted for easy renaming
export const APP_NAME = 'Codefin'
export const SCORE_LABEL = 'Score'

// Navigation items
export const NAV_ITEMS = [
  { label: 'Feed', href: '/feed' },
  { label: 'Trending', href: '/trending' },
  { label: 'New', href: '/new' },
  { label: 'Top', href: '/top' },
] as const

// Programming languages for dropdown (alphabetical order)
export const LANGUAGES = [
  'C#',
  'C++',
  'CSS',
  'Dart',
  'Elixir',
  'Go',
  'HTML',
  'Java',
  'JavaScript',
  'JSON',
  'Kotlin',
  'Markdown',
  'Other',
  'PHP',
  'PowerShell',
  'Python',
  'Ruby',
  'Rust',
  'Shell',
  'SQL',
  'Solidity',
  'Swift',
  'TypeScript',
  'Zig',
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

// Language colors mapping
export const LANGUAGE_COLORS: Record<string, string> = {
  javascript: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  typescript: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  python: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  go: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  rust: 'bg-orange-300/10 text-orange-400 border-orange-300/20',
  java: 'bg-amber-700/10 text-amber-700 border-amber-700/20',
  'c++': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  'c#': 'bg-green-500/10 text-green-600 border-green-500/20',
  ruby: 'bg-red-800/10 text-red-800 border-red-800/20',
  php: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  swift: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  kotlin: 'bg-purple-400/10 text-purple-500 border-purple-400/20',
  html: 'bg-orange-600/10 text-orange-600 border-orange-600/20',
  css: 'bg-purple-700/10 text-purple-700 border-purple-700/20',
  sql: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  shell: 'bg-green-400/10 text-green-500 border-green-400/20',
  dart: 'bg-[#00B4AB]/10 text-[#00B4AB] border-[#00B4AB]/20',
  elixir: 'bg-[#6e4a7e]/10 text-[#6e4a7e] border-[#6e4a7e]/20',
  json: 'bg-[#292929]/10 text-[#292929] border-[#292929]/20',
  markdown: 'bg-[#083fa1]/10 text-[#083fa1] border-[#083fa1]/20',
  powershell: 'bg-[#012456]/10 text-[#012456] border-[#012456]/20',
  solidity: 'bg-[#AA6746]/10 text-[#AA6746] border-[#AA6746]/20',
  zig: 'bg-[#ec915c]/10 text-[#ec915c] border-[#ec915c]/20',
  other: 'bg-muted text-muted-foreground border-border',
}

export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language.toLowerCase()] || LANGUAGE_COLORS.other
}
