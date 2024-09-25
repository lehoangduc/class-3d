import ms from 'ms'

export const formatDateTime = (datetime: Date | string) => {
  if (datetime.toString() === 'Invalid Date') return ''

  return new Date(datetime).toLocaleTimeString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}

export const timeAgo = (
  timestamp: Date | null,
  {
    withAgo,
  }: {
    withAgo?: boolean
  } = {},
): string => {
  if (!timestamp) return 'Never'

  const diff = Date.now() - new Date(timestamp).getTime()
  if (diff < 1000) {
    return 'Just now'
  }

  if (diff > 82800000) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        new Date(timestamp).getFullYear() !== new Date().getFullYear()
          ? 'numeric'
          : undefined,
    })
  }

  return `${ms(diff)}${withAgo ? ' ago' : ''}`
}
