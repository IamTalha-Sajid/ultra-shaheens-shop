export function generateOrderId(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '') // e.g. 20260521
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6) // 4 random chars
  return `US-${dateStr}-${rand}`
}
