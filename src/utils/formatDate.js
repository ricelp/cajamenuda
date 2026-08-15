// Utilidades para manejar fechas en formato ISO (aaaa-mm-dd).

/** Devuelve la fecha de hoy en formato ISO local (aaaa-mm-dd). */
export function hoyISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Devuelve una fecha desplazada en días a partir de hoy (formato ISO). */
export function fechaRelativa(dias) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Convierte una fecha ISO (aaaa-mm-dd) a formato legible dd/mm/aaaa. */
export function formatearFecha(fechaISO) {
  if (!fechaISO) return ''
  const [anio, mes, dia] = String(fechaISO).split('-')
  if (!anio || !mes || !dia) return fechaISO
  return `${dia}/${mes}/${anio}`
}