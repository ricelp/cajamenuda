import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import * as api from '../services/api.js'
import { redondear } from '../utils/formatCurrency.js'

// Contexto global de Caja Menuda.
// Comparte entre todas las páginas el estado de: gastos, saldo
// inicial, conciliación y las operaciones CRUD correspondientes.
export const GastosContext = createContext(null)

export function GastosProvider({ children }) {
  // ---------- ESTADO INICIAL ----------
  // Los datos se cargan desde localStorage al montar el proveedor.
  const [gastos, setGastos] = useState(() => api.cargarGastosLocal())
  const [saldoInicial, setSaldoInicial] = useState(() => api.obtenerSaldoInicialLocal())
  const [conciliacion, setConciliacion] = useState(() => api.cargarConciliacionLocal())
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Referencias para limpiar recursos en el desmontaje
  const timerRef = useRef(null)

  // ---------- CICLO DE VIDA: MONTAJE ----------
  // Al montar la aplicación se siembran los datos iniciales y se
  // "consultan" los gastos con un pequeño retardo para poder mostrar
  // el Skeleton / Spinner mientras "carga".
  useEffect(() => {
    api.sembrarDatosIniciales()

    timerRef.current = setTimeout(() => {
      setGastos(api.cargarGastosLocal())
      setSaldoInicial(api.obtenerSaldoInicialLocal())
      setCargando(false)
    }, 600)

    // ---------- CICLO DE VIDA: DESMONTAJE ----------
    // Se limpian los recursos: el temporizador pendiente.
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // ---------- CICLO DE VIDA: ACTUALIZACIÓN ----------
  // Cada vez que cambia la lista de gastos se persiste en
  // localStorage para conservar los datos entre sesiones.
  useEffect(() => {
    api.guardarGastosLocal(gastos)
  }, [gastos])

  /** Recarga los datos desde localStorage (botón "Actualizar"). */
  const recargar = useCallback(() => {
    setCargando(true)
    setError(null)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setGastos(api.cargarGastosLocal())
      setSaldoInicial(api.obtenerSaldoInicialLocal())
      setCargando(false)
    }, 500)
  }, [])

  /** Agrega un gasto y además demuestra el POST hacia la API pública. */
  const agregarGasto = useCallback((datos) => {
    const nuevoGasto = { ...datos, id: api.generarId(), createdAt: Date.now(), origen: datos.origen || 'local' }
    setGastos((prev) => [nuevoGasto, ...prev])

    // Demostración de POST: se envía a la API pública, pero el resultado
    // se ignora porque la persistencia real de Caja Menuda es local.
    api.enviarGastoEjemploApi(nuevoGasto).catch(() => {})
    return nuevoGasto
  }, [])

  const actualizarGasto = useCallback((id, cambios) => {
    setGastos((prev) => prev.map((g) => (g.id === id ? { ...g, ...cambios } : g)))
  }, [])

  const eliminarGasto = useCallback((id) => {
    setGastos((prev) => prev.filter((g) => g.id !== id))
  }, [])

  const guardarSaldoInicial = useCallback((monto) => {
    const valor = redondear(Number(monto))
    setSaldoInicial(valor)
    api.guardarSaldoInicialLocal(valor)
  }, [])

  const guardarConciliacion = useCallback((datos) => {
    setConciliacion(datos)
    api.guardarConciliacionLocal(datos)
  }, [])

  /**
   * Descarga gastos de ejemplo desde la API pública (DummyJSON).
   * Recibe una señal de AbortController para que la página pueda
   * cancelar la petición al desmontarse (CICLO DE VIDA: DESMONTAJE).
   */
  const cargarGastosEjemploApi = useCallback(async (signal) => {
    setError(null)
    const gastosApi = await api.obtenerGastosEjemploApi({ signal })

    // Evita duplicar los gastos de la API si ya se cargaron antes
    setGastos((prev) => {
      const yaCargados = prev.some((g) => g.origen === 'api')
      return yaCargados ? prev : [...prev, ...gastosApi]
    })
    return gastosApi
  }, [])

  const valor = {
    gastos,
    saldoInicial,
    conciliacion,
    cargando,
    error,
    agregarGasto,
    actualizarGasto,
    eliminarGasto,
    guardarSaldoInicial,
    guardarConciliacion,
    cargarGastosEjemploApi,
    recargar,
  }

  return <GastosContext.Provider value={valor}>{children}</GastosContext.Provider>
}