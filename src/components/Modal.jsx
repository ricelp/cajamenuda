import { useEffect } from 'react'
import { Icon } from './Icons.jsx'

/**
 * Modal genérico reutilizable.
 *
 * CICLO DE VIDA: MONTAJE / DESMONTAJE
 * Al abrirse se registra un listener de teclado (tecla Escape) y al
 * cerrarse (desmontaje) el listener se elimina.
 */
export default function Modal({ abierto, titulo, onClose, children, ancho = 'md' }) {
  useEffect(() => {
    if (!abierto) return undefined

    const manejarTecla = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', manejarTecla)

    // CICLO DE VIDA: DESMONTAJE — limpieza del listener
    return () => document.removeEventListener('keydown', manejarTecla)
  }, [abierto, onClose])

  if (!abierto) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal-${ancho}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{titulo}</h3>
          <button type="button" className="btn-icono" onClick={onClose} aria-label="Cerrar">
            <Icon nombre="cerrar" size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}