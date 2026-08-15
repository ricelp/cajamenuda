// ============================================================
// CAPA DE SERVICIOS
// ------------------------------------------------------------
// Aquí viven TODAS las llamadas HTTP (API pública) y el acceso a
// localStorage de Caja Menuda. Los componentes NUNCA hacen fetch
// directamente; siempre pasan por esta capa de servicios.
//
// API pública utilizada: DummyJSON (https://dummyjson.com)
// Se usa para DEMOSTRAR el consumo de una API REST real:
//   - GET  https://dummyjson.com/products  (cargar gastos de ejemplo)
//   - POST https://dummyjson.com/products/add (enviar un gasto)
//
// La persistencia real de Caja Menuda es LOCAL (localStorage),
// como se documenta en el README.
// ============================================================

import { fechaRelativa, hoyISO } from '../utils/formatDate.js'
import { redondear } from '../utils/formatCurrency.js'

const BASE_URL = 'https://dummyjson.com'

// Claves utilizadas en localStorage
const KEYS = {
  gastos: 'cajaMenuda:gastos',
  saldoInicial: 'cajaMenuda:saldoInicial',
  conciliacion: 'cajaMenuda:conciliacion',
  sembrado: 'cajaMenuda:sembrado',
}

// Categorías del sistema de Caja Menuda
export const CATEGORIAS = [
  'Alimentación',
  'Transporte',
  'Papelería',
  'Limpieza',
  'Mantenimiento',
  'Combustible',
  'Mensajería',
  'Otros',
]

// Mapa para traducir categorías de la API a categorías del sistema
const MAPEO_CATEGORIAS_API = {
  groceries: 'Alimentación',
  'food-beverage': 'Alimentación',
  automotive: 'Combustible',
  motorcycle: 'Combustible',
  furniture: 'Mantenimiento',
  'home-decoration': 'Mantenimiento',
  lighting: 'Mantenimiento',
  'kitchen-accessories': 'Mantenimiento',
  'mens-shirts': 'Otros',
  'womens-dresses': 'Otros',
  smartphones: 'Otros',
  laptops: 'Otros',
  fragrances: 'Otros',
  skincare: 'Otros',
  beauty: 'Otros',
  'sports-accessories': 'Otros',
  sunglasses: 'Otros',
  'womens-bags': 'Otros',
  'womens-jewellery': 'Otros',
  tops: 'Otros',
  'womens-shoes': 'Otros',
  'mens-shoes': 'Otros',
  'mens-watches': 'Otros',
  'womens-watches': 'Otros',
  'mens-shorts': 'Otros',
  'womens-shorts': 'Otros',
  'womens-dresses-kids': 'Otros',
  'mens-shoes-kids': 'Otros',
  'mens-shirts-kids': 'Otros',
  'womens-shoes-kids': 'Otros',
  'womens-dresses-2': 'Otros',
  'womens-shoes-2': 'Otros',
  'mens-shirts-2': 'Otros',
  'womens-dresses-3': 'Otros',
  'womens-shoes-3': 'Otros',
  'mens-shirts-3': 'Otros',
  'womens-dresses-4': 'Otros',
  'womens-shoes-4': 'Otros',
  'mens-shirts-4': 'Otros',
  'womens-dresses-5': 'Otros',
  'womens-shoes-5': 'Otros',
  'mens-shirts-5': 'Otros',
}

function mapearCategoria(categoriaApi) {
  return MAPEO_CATEGORIAS_API[categoriaApi] || 'Otros'
}

// ------------------------------------------------------------
// API PÚBLICA (DummyJSON) — DEMOSTRACIÓN DE GET
// ------------------------------------------------------------
/**
 * Descarga productos de DummyJSON y los transforma en gastos de
 * demostración. Acepta una señal de AbortController para poder
 * cancelar la petición al desmontar el componente.
 */
export async function obtenerGastosEjemploApi({ signal } = {}) {
  const respuesta = await fetch(
    `${BASE_URL}/products?limit=6&select=title,price,thumbnail,category`,
    { signal },
  )

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}`)
  }

  const datos = await respuesta.json()

  return (datos.products || []).map((producto) => ({
    fecha: hoyISO(),
    descripcion: producto.title,
    categoria: mapearCategoria(producto.category),
    monto: redondear(Number(producto.price)),
    factura: `FAC-API-${producto.id}`,
    proveedor: 'DummyJSON',
    observaciones: 'Gasto de demostración cargado desde la API pública DummyJSON.',
    imagen: producto.thumbnail,
    origen: 'api',
    createdAt: Date.now(),
  }))
}

// ------------------------------------------------------------
// API PÚBLICA (DummyJSON) — DEMOSTRACIÓN DE POST
// ------------------------------------------------------------
/**
 * Envía un gasto a la API pública mediante POST. En esta versión
 * académica el resultado NO se usa para la persistencia real (que
 * es local), solo demuestra el envío de datos a una API REST.
 */
export async function enviarGastoEjemploApi(gasto) {
  const respuesta = await fetch(`${BASE_URL}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: gasto.descripcion,
      price: Number(gasto.monto),
      category: gasto.categoria,
    }),
  })

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}`)
  }

  return respuesta.json()
}

// ------------------------------------------------------------
// PERSISTENCIA LOCAL (localStorage)
// ------------------------------------------------------------
export function cargarGastosLocal() {
  try {
    const crudo = localStorage.getItem(KEYS.gastos)
    return crudo ? JSON.parse(crudo) : []
  } catch {
    // Si el JSON está corrupto se devuelve una lista vacía
    return []
  }
}

export function guardarGastosLocal(gastos) {
  localStorage.setItem(KEYS.gastos, JSON.stringify(gastos))
}

export function obtenerSaldoInicialLocal() {
  const valor = localStorage.getItem(KEYS.saldoInicial)
  if (valor == null) return 500
  return redondear(Number(valor))
}

export function guardarSaldoInicialLocal(monto) {
  localStorage.setItem(KEYS.saldoInicial, String(redondear(monto)))
}

export function cargarConciliacionLocal() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.conciliacion)) || null
  } catch {
    return null
  }
}

export function guardarConciliacionLocal(datos) {
  localStorage.setItem(KEYS.conciliacion, JSON.stringify(datos))
}

/** Genera un identificador único para cada gasto. */
export function generarId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  return `gasto-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ------------------------------------------------------------
// DATOS DE PRUEBA
// ------------------------------------------------------------
// Se siembran una sola vez para que el sistema pueda demostrarse
// fácilmente sin necesidad de registrar gastos manualmente.
const GASTOS_INICIALES = [
  { descripcion: 'Compra de papelería', categoria: 'Papelería', monto: 25.5, proveedor: 'Librería ABC', factura: 'FAC-00001' },
  { descripcion: 'Combustible para vehículo', categoria: 'Combustible', monto: 40, proveedor: 'Estación Terpel', factura: 'FAC-00002' },
  { descripcion: 'Alimentación del personal', categoria: 'Alimentación', monto: 15, proveedor: 'Super 99', factura: 'FAC-00003' },
  { descripcion: 'Material de limpieza', categoria: 'Limpieza', monto: 20, proveedor: 'Ferretería El Constructor', factura: 'FAC-00004' },
  { descripcion: 'Transporte de documentos', categoria: 'Transporte', monto: 10, proveedor: 'Taxi Express', factura: 'FAC-00005' },
  { descripcion: 'Mantenimiento de aires acondicionados', categoria: 'Mantenimiento', monto: 18.75, proveedor: 'Técnicos CR', factura: 'FAC-00006' },
]

export function sembrarDatosIniciales() {
  // Solo se siembran los datos la primera vez que se abre la aplicación
  if (localStorage.getItem(KEYS.sembrado)) return

  const gastos = GASTOS_INICIALES.map((g, indice) => ({
    ...g,
    // Un gasto se registra ayer para demostrar el filtro por fecha
    fecha: indice === GASTOS_INICIALES.length - 1 ? fechaRelativa(-1) : hoyISO(),
    observaciones: 'Gasto de demostración inicial del sistema.',
    imagen: null,
    origen: 'inicial',
    createdAt: Date.now() - indice * 1000,
  }))

  guardarGastosLocal(gastos)
  guardarSaldoInicialLocal(500)
  localStorage.setItem(KEYS.sembrado, '1')
}