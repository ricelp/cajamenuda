import { useContext } from 'react'
import { GastosContext } from '../context/GastosContext.jsx'

/**
 * Hook de acceso a los datos de Caja Menuda.
 * Centraliza el estado global (gastos, saldo inicial, conciliación)
 * y las operaciones CRUD.
 *
 * Uso:
 *   const { gastos, saldoInicial, agregarGasto, ... } = useGastos()
 */
export function useGastos() {
  const contexto = useContext(GastosContext)

  if (!contexto) {
    throw new Error('useGastos debe usarse dentro de <GastosProvider>.')
  }

  return contexto
}