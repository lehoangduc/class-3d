export function nFormatter(
  num?: number,
  opts: { digits?: number; full?: boolean } = {
    digits: 1,
  },
) {
  if (!num) return '0'
  if (opts.full) {
    return Intl.NumberFormat('en-US').format(num)
  }

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/

  if (num < 1) {
    return num.toFixed(opts.digits).replace(rx, '$1')
  }

  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]

  const item = lookup
    .slice()
    .reverse()
    .find((item) => {
      return num >= item.value
    })

  return item
    ? (num / item.value).toFixed(opts.digits).replace(rx, '$1') + item.symbol
    : '0'
}

export function convertBytes(
  bytes: number,
  options: { useBinaryUnits?: boolean; decimals?: number } = {},
): string {
  const { useBinaryUnits = false, decimals = 2 } = options

  if (decimals < 0) {
    throw new Error(`Invalid decimals ${decimals}`)
  }

  const base = useBinaryUnits ? 1024 : 1000
  const units = useBinaryUnits
    ? ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    : ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(base))

  return `${(bytes / base ** i).toFixed(decimals)} ${units[i]}`
}
