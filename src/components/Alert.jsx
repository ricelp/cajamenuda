import { Icon } from './Icons.jsx'

/**
 * Alerta de mensajes de éxito, error o información.
 * Uso: <Alert tipo="exito" mensaje="Gasto guardado." onClose={...} />
 */
export default function Alert({ tipo = 'info', mensaje, onClose }) {
  const iconos = { exito: 'checado', error: 'alerta', info: 'info' }

  return (
    <div className={`alerta alerta-${tipo}`} role="alert">
      <span className="alerta-icono">
        <Icon nombre={iconos[tipo] || 'info'} size={18} />
      </span>
      <p>{mensaje}</p>
      {onClose && (
        <button type="button" className="alerta-cerrar" onClick={onClose} aria-label="Cerrar mensaje">
          <Icon nombre="cerrar" size={15} />
        </button>
      )}
    </div>
  )
}