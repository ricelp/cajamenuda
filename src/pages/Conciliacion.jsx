import { useMemo, useState } from 'react'
import { useGastos } from '../hooks/useGastos.js'
import Alert from '../components/Alert.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatearFecha, hoyISO } from '../utils/formatDate.js'
import { formatCurrency, parseMonto, redondear } from '../utils/formatCurrency.js'
import { Icon } from '../components/Icons.jsx'

/**
 * Conciliación de caja.
 *
 * Fórmulas:
 *   Total gastos      = suma de los gastos de la fecha seleccionada
 *   Saldo esperado    = Saldo inicial - Total gastos
 *   Diferencia        = Dinero contado - Saldo esperado
 *
 * Resultado: CUADRA (0), SOBRANTE (>0) o FALTANTE (<0).
 */
export default function Conciliacion() {
  const { gastos, saldoInicial, conciliacion, guardarSaldoInicial, guardarConciliacion } =
    useGastos()

  const [fecha, setFecha] = useState(hoyISO())
  const [saldoInput, setSaldoInput] = useState(String(saldoInicial))
  const [contadoInput, setContadoInput] = useState('')
  const [guardado, setGuardado] = useState('')

  // ---------- ACTUALIZACIÓN: los cálculos se recalculan al cambiar fecha/saldos ----------
  const gastosDelDia = useMemo(
    () => gastos.filter((gasto) => gasto.fecha === fecha),
    [gastos, fecha],
  )

  const totalGastos = redondear(
    gastosDelDia.reduce((suma, gasto) => suma + Number(gasto.monto), 0),
  )
  const saldoInicialNum = redondear(parseMonto(saldoInput) || 0)
  const saldoEsperado = redondear(saldoInicialNum - totalGastos)
  const dineroContado = redondear(parseMonto(contadoInput) || 0)
  const diferencia = redondear(dineroContado - saldoEsperado)

  // Estado del resultado
  const estado =
    diferencia === 0 ? 'cuadra' : diferencia > 0 ? 'sobrante' : 'faltante'

  const etiquetaEstado = {
    cuadra: 'CUADRA',
    sobrante: 'SOBRANTE',
    faltante: 'FALTANTE',
  }[estado]

  function aplicarSaldoInicial() {
    guardarSaldoInicial(saldoInicialNum)
  }

  function guardar() {
    const datos = {
      fecha,
      saldoInicial: saldoInicialNum,
      totalGastos,
      saldoEsperado,
      dineroContado,
      diferencia,
      estado,
      cantidadGastos: gastosDelDia.length,
    }
    guardarConciliacion(datos)
    setGuardado(`Conciliación del ${formatearFecha(fecha)} guardada correctamente.`)
  }

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <div>
          <h1>Conciliación de caja</h1>
          <p>Compara el dinero esperado con el dinero contado para detectar diferencias.</p>
        </div>
      </header>

      {guardado && <Alert tipo="exito" mensaje={guardado} onClose={() => setGuardado('')} />}

      <div className="grid-conciliacion">
        {/* Entrada de datos */}
        <section className="tarjeta">
          <h2>Datos</h2>
          <div className="form-grid">
            <div className="campo">
              <label htmlFor="conc-fecha">Fecha</label>
              <input
                id="conc-fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div className="campo">
              <label htmlFor="conc-saldo">Saldo inicial (B/.)</label>
              <div className="input-con-boton">
                <input
                  id="conc-saldo"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  value={saldoInput}
                  onChange={(e) => setSaldoInput(e.target.value)}
                />
                <button type="button" className="btn btn-secundario" onClick={aplicarSaldoInicial}>
                  Aplicar
                </button>
              </div>
            </div>
            <div className="campo campo-ancho">
              <label htmlFor="conc-contado">Dinero contado (B/.)</label>
              <input
                id="conc-contado"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                placeholder="Ej. 370.00"
                value={contadoInput}
                onChange={(e) => setContadoInput(e.target.value)}
              />
            </div>
          </div>
          <p className="ayuda">
            Dinero contado: cantidad física de dinero que hay en la caja al cierre de la fecha
            seleccionada.
          </p>
        </section>

        {/* Resultado */}
        <section className="tarjeta">
          <div className="seccion-cabecera">
            <h2>Resultado</h2>
            <span className={`badge-estado badge-${estado}`}>
              <Icon nombre={estado === 'cuadra' ? 'checado' : 'alerta'} size={14} />
              {etiquetaEstado}
            </span>
          </div>

          <table className="tabla-resultado">
            <tbody>
              <tr>
                <td>Saldo inicial</td>
                <td>{formatCurrency(saldoInicialNum)}</td>
              </tr>
              <tr>
                <td>Total de gastos</td>
                <td>− {formatCurrency(totalGastos)}</td>
              </tr>
              <tr className="fila-total">
                <td>Saldo esperado</td>
                <td>{formatCurrency(saldoEsperado)}</td>
              </tr>
              <tr>
                <td>Dinero contado</td>
                <td>{formatCurrency(dineroContado)}</td>
              </tr>
              <tr className={`fila-diferencia diferencia-${estado}`}>
                <td>Diferencia</td>
                <td>{formatCurrency(diferencia)}</td>
              </tr>
            </tbody>
          </table>

          {estado !== 'cuadra' && contadoInput !== '' && (
            <Alert
              tipo={estado === 'sobrante' ? 'info' : 'error'}
              mensaje={`${etiquetaEstado}: ${formatCurrency(Math.abs(diferencia))}`}
            />
          )}

          {gastosDelDia.length === 0 && (
            <EmptyState
              titulo="Sin gastos"
              mensaje={`No existen gastos registrados para el ${formatearFecha(fecha)}.`}
            />
          )}

          <div className="form-acciones">
            <button type="button" className="btn btn-primario" onClick={guardar}>
              <Icon nombre="checado" size={16} /> Guardar conciliación
            </button>
          </div>
        </section>
      </div>

      {conciliacion && conciliacion.fecha === fecha && (
        <div className="tarjeta">
          <h2>Última conciliación guardada</h2>
          <p>
            {formatearFecha(conciliacion.fecha)} · {conciliacion.cantidadGastos} registros ·{' '}
            {etiquetaGuardada(conciliacion)}
          </p>
        </div>
      )}
    </div>
  )
}

function etiquetaGuardada(datos) {
  if (datos.estado === 'cuadra') return `CUADRA (${formatCurrency(datos.diferencia)})`
  const tipo = datos.estado === 'sobrante' ? 'Sobrante' : 'Faltante'
  return `${tipo}: ${formatCurrency(Math.abs(datos.diferencia))}`
}