import { formatearFecha } from '../utils/formatDate.js'
import { formatCurrency } from '../utils/formatCurrency.js'
import { Icon } from './Icons.jsx'

/**
 * Tarjeta de gasto (se muestra en móvil en lugar de la tabla).
 * La tabla es difícil de usar en pantallas pequeñas, así que en
 * móvil se convierte en tarjetas.
 */
export default function ExpenseCard({ gasto, onVer, onEditar, onEliminar, onVerEvidencia }) {
  return (
    <article className="tarjeta-gasto">
      <div className="tarjeta-gasto-cabecera">
        <div className="tarjeta-gasto-titulo">
          <strong>{gasto.descripcion}</strong>
          <span className="badge">{gasto.categoria}</span>
        </div>
        <strong className="tarjeta-gasto-monto">{formatCurrency(gasto.monto)}</strong>
      </div>

      <div className="tarjeta-gasto-detalle">
        <span>
          <Icon nombre="calendario" size={14} /> {formatearFecha(gasto.fecha)}
        </span>
        {gasto.factura && (
          <span>
            <Icon nombre="reporte" size={14} /> {gasto.factura}
          </span>
        )}
        {gasto.proveedor && (
          <span>
            <Icon nombre="proveedor" size={14} /> {gasto.proveedor}
          </span>
        )}
      </div>

      <div className="tarjeta-gasto-acciones">
        <button type="button" className="btn btn-secundario" onClick={() => onVerEvidencia(gasto)}>
          <Icon nombre="imagen" size={16} /> Ver factura
        </button>
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
      </div>
    </article>
  )
}