/**
 * Formatea minutos a una cadena legible de tiempo.
 * Ejemplo: 125 -> "2h 5 min", 1500 -> "1d 1h", etc.
 */
export function formatWatchtime(minutes?: number): string {
  if (!minutes || minutes === 0) return '0 min'
  const HOUR = 60
  const DAY = HOUR * 24
  const WEEK = DAY * 7
  const MONTH = DAY * 30
  const YEAR = DAY * 365
  const units: Array<{ label: string; divisor: number }> = [
    { label: 'a', divisor: YEAR },
    { label: 'm', divisor: MONTH },
    { label: 's', divisor: WEEK },
    { label: 'd', divisor: DAY },
    { label: 'h', divisor: HOUR },
  ]
  const parts: string[] = []
  let remaining = minutes
  for (const { label, divisor } of units) {
    const value = Math.floor(remaining / divisor)
    if (value > 0) {
      parts.push(`${value}${label}`)
      remaining = remaining % divisor
    }
  }
  // Si quedan minutos residuales y no tenemos mas de 2 partes grandes
  if (remaining > 0 && parts.length < 3) {
    parts.push(`${Math.round(remaining)} min`)
  }
  // Si no se genero ninguna parte (improbable), retornar minutos
  if (parts.length === 0) {
    return `${Math.round(minutes)} min`
  }
  // Retornar maximo 3 unidades para legibilidad
  return parts.slice(0, 3).join(' ')
}
