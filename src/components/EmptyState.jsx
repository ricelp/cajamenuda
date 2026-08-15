import { Icon } from './Icons.jsx'

/**
 * Estado vacío: se muestra cuando no existen resultados.
 * Uso:
 *   <EmptyState
 *     titulo="No existen gastos"
 *     mensaje="Registra el primer gasto."
 *     botonTexto="Registrar primer gasto"
 *     onBoton={...}
 *   />
 */
export default function EmptyState({ titulo = 'Sin resultados', mensaje, botonTexto, onBoton }) {
  return (
    <div className="estado-vacio">
      <div className="estado-vacio-icono">
        <Icon nombre="caja" size={34} />
      </div>
      <h3>{titulo}</h3>
      {mensaje && <p>{mensaje}</p>}
      {botonTexto && (
        <button type="button" className="btn btn-primario" onClick={onBoton}>
          <Icon nombre="mas" size={16} />
          {botonTexto}
        </button>
      )}
    </div>
  )
}