export function formatDate(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatScore(score: number): string {
  if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`
  if (score >= 1000) return `${(score / 1000).toFixed(1)}k`
  return score.toString()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
