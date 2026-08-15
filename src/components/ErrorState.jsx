import { Icon } from './Icons.jsx'

/**
 * Estado de error: se muestra cuando falla la consulta de datos.
 * El botón "Reintentar" vuelve a ejecutar la petición.
 */
export default function ErrorState({
  mensaje = 'No fue posible cargar la información.',
  onReintentar,
}) {
  return (
    <div className="estado-error">
      <div className="estado-error-icono">
        <Icon nombre="alerta" size={34} />
      </div>
      <h3>Ocurrió un error</h3>
      <p>{mensaje}</p>
      {onReintentar && (
        <button type="button" className="btn btn-primario" onClick={onReintentar}>
          <Icon nombre="refrescar" size={16} />
          Reintentar
        </button>
      )}
    </div>
  )
}