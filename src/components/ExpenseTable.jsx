import { formatearFecha } from '../utils/formatDate.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { Icon } from './Icons.jsx'

/**
 * Tabla de gastos (se muestra en escritorio y tablet).
 */
export default function ExpenseTable({ gastos, onVer, onEditar, onEliminar, onVerEvidencia }) {
  return (
    <div className="tabla-envoltura">
      <table className="tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Factura</th>
            <th className="derecha">Monto</th>
            <th className="centro">Evidencia</th>
            <th className="centro">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((gasto) => (
            <tr key={gasto.id}>
              <td className="celda-fecha">{formatearFecha(gasto.fecha)}</td>
              <td>
                <strong>{gasto.descripcion}</strong>
                {gasto.proveedor && <small className="celda-sub">{gasto.proveedor}</small>}
              </td>
              <td>
                <span className="badge">{gasto.categoria}</span>
              </td>
              <td>{gasto.factura || '—'}</td>
              <td className="derecha">
                <strong>{formatCurrency(gasto.monto)}</strong>
              </td>
              <td className="centro">
                <button
                  type="button"
                  className="btn-icono"
                  onClick={() => onVerEvidencia(gasto)}
                  title="Ver factura / recibo"
                >
                  {gasto.imagen ? (
                    <img src={gasto.imagen} alt="Factura" className="mini-foto" />
                  ) : (
                    <Icon nombre="imagen" size={18} />
                  )}
                </button>
              </td>
              <td className="centro">
                <div className="acciones">
                  <button type="button" className="btn-icono" onClick={() => onVer(gasto)} title="Ver">
                    <Icon nombre="ver" size={17} />
                  </button>
                  <button type="button" className="btn-icono" onClick={() => onEditar(gasto)} title="Editar">
                    <Icon nombre="editar" size={17} />
                  </button>
                  <button
                    type="button"
                    className="btn-icono peligro"
                    onClick={() => onEliminar(gasto)}
                    title="Eliminar"
                  >
                    <Icon nombre="eliminar" size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}