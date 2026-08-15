import { useMemo, useState } from 'react'
import { useGastos } from '../hooks/useGastos.js'
import EmptyState from '../components/EmptyState.jsx'
import { formatearFecha, hoyISO } from '../utils/formatDate.js'
import { formatCurrency, redondear } from '../utils/formatCurrency.js'
import { Icon } from '../components/Icons.jsx'

/**
 * Reporte diario: permite seleccionar una fecha y generar un reporte
 * con el resumen y el detalle de los gastos del día. Se imprime con
 * window.print() (el CSS aplica una vista solo para impresión).
 */
export default function ReporteDiario() {
  const { gastos, saldoInicial, conciliacion } = useGastos()

  const [fecha, setFecha] = useState(hoyISO())
  const [generado, setGenerado] = useState(false)

  // ---------- ACTUALIZACIÓN: el reporte se recalcula según la fecha ----------
  const gastosDelDia = useMemo(
    () =>
      gastos
        .filter((gasto) => gasto.fecha === fecha)
        .sort((a, b) => a.createdAt - b.createdAt),
    [gastos, fecha],
  )
  const total = redondear(
    gastosDelDia.reduce((suma, gasto) => suma + Number(gasto.monto), 0),
  )

  // Si hay una conciliación guardada para esa fecha se usa, si no se
  // calcula con el saldo inicial y el dinero contado = saldo esperado.
  const datosConc = conciliacion && conciliacion.fecha === fecha ? conciliacion : null
  const saldoInicialR = redondear(datosConc ? Number(datosConc.saldoInicial) : Number(saldoInicial))
  const saldoEsperado = redondear(saldoInicialR - total)
  const dineroContado = datosConc ? redondear(Number(datosConc.dineroContado)) : saldoEsperado
  const diferencia = redondear(dineroContado - saldoEsperado)

  const estado =
    diferencia === 0 ? 'cuadra' : diferencia > 0 ? 'sobrante' : 'faltante'
  const etiquetaEstado =
    estado === 'cuadra'
      ? 'CUADRA'
      : `${estado === 'sobrante' ? 'Sobrante' : 'Faltante'}: ${formatCurrency(Math.abs(diferencia))}`

  function generar() {
    setGenerado(true)
  }

  function imprimir() {
    window.print()
  }

  return (
    <div className="pagina">
      <header className="pagina-cabecera">
        <div>
          <h1>Reporte diario</h1>
          <p>Selecciona una fecha y genera el reporte de gastos del día.</p>
        </div>
      </header>

      {/* Selector de fecha */}
      <section className="tarjeta">
        <div className="reporte-filtro">
          <div className="campo">
            <label htmlFor="reporte-fecha">Fecha</label>
            <input
              id="reporte-fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primario" onClick={generar}>
            <Icon nombre="reporte" size={16} /> Generar reporte
          </button>
        </div>
      </section>

      {/* Contenido del reporte (área imprimible) */}
      {generado && (
        <div className="tarjeta reporte-area">
          <div className="reporte-cabecera">
            <div className="logo-caja">
              <Icon nombre="caja" size={26} />
            </div>
            <div>
              <h2>Reporte diario de Caja Menuda</h2>
              <p>Fecha del reporte: {formatearFecha(fecha)}</p>
            </div>
          </div>

          <h3 className="reporte-subtitulo">Resumen</h3>
          <table className="tabla-resultado reporte-tabla">
            <tbody>
              <tr>
                <td>Saldo inicial</td>
                <td>{formatCurrency(saldoInicialR)}</td>
              </tr>
              <tr>
                <td>Total de gastos</td>
                <td>{formatCurrency(total)}</td>
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
          <p className="reporte-estado">
            <span className={`badge-estado badge-${estado}`}>{etiquetaEstado}</span>
          </p>

          <h3 className="reporte-subtitulo">Detalle de gastos</h3>

          {gastosDelDia.length === 0 ? (
            <EmptyState
              titulo="Sin gastos"
              mensaje={`No existen gastos registrados para el ${formatearFecha(fecha)}.`}
            />
          ) : (
            <>
              <div className="tabla-envoltura">
                <table className="tabla reporte-tabla">
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Factura</th>
                      <th className="derecha">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastosDelDia.map((gasto) => (
                      <tr key={gasto.id}>
                        <td>{gasto.descripcion}</td>
                        <td>
                          <span className="badge">{gasto.categoria}</span>
                        </td>
                        <td>{gasto.factura || '—'}</td>
                        <td className="derecha">{formatCurrency(gasto.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="reporte-total">
                <strong>TOTAL DEL DÍA:</strong>
                <span>{formatCurrency(total)}</span>
              </div>
            </>
          )}

          <div className="reporte-acciones no-print">
            <button type="button" className="btn btn-primario" onClick={imprimir}>
              <Icon nombre="imprimir" size={16} /> Imprimir reporte
            </button>
          </div>
        </div>
      )}
    </div>
  )
}