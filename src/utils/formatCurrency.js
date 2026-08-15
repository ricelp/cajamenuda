// Utilidades para formatear y convertir montos en Balboas (B/.).

/**
 * Convierte un valor numérico a formato de moneda de Panamá (Balboa).
 * Ejemplo: 500 -> "B/. 500.00"
 */
export function formatCurrency(monto) {
  const numero = Number(monto) || 0
  return `B/. ${numero.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Convierte el texto de un input a número válido.
 * Acepta "35,50" o "35.50" y devuelve 35.5.
 * Devuelve NaN si el texto está vacío o no es numérico.
 */
export function parseMonto(texto) {
  if (texto == null || texto === '') return NaN
  const normalizado = String(texto).trim().replace(/,/g, '.').replace(/[^\d.]/g, '')
  return Number(normalizado)
}

/**
 * Redondea a 2 decimales para evitar errores de coma flotante
 * (por ejemplo 0.1 + 0.2 === 0.30000000000000004).
 */
export function redondear(monto) {
  return Math.round((Number(monto) || 0) * 100) / 100
}